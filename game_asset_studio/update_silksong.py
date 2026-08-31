import json

db_path = r'd:\folder\tools\game_asset_studio\game_projects.json'
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

for g in db['games']:
    if g['id'] == 'game_crossy_rooster':
        g['title'] = 'Rooster Knight: Feather Song (Silksong Metroidvania)'
        g['genre'] = '2D Fast-Paced Action Metroidvania & Platformer (Hollow Knight / Silksong Style)'
        g['art_style'] = '16-Bit Bioluminescent Gothic Pixel Art, Dark Fantasy, Fluid Combat FX'
        g['raw_input_story'] = 'Game Metroidvania hành động chặt chém đỉnh cao phong cách Silksong: Hiệp sĩ gà chiến thức tỉnh trong vương quốc bóng tối, lướt chém song đao, pogo đạp cựa trên không, né bẫy gai và trảm đại trùm nhện dệt tơ.'
        g['full_story'] = {
            'synopsis': 'Vương quốc ngầm Phantasmagoria bị thống trị bởi Nữ Hoàng Nhện Dệt Gai và bầy quái vật bóng đêm. Hiệp sĩ gà Rooster Knight mang theo cựa kiếm thần thánh thức tỉnh từ giấc ngủ nghìn năm, dấn thân vào mê cung hang động rêu phong, leo lên tháp chuông tơ vàng để giải phóng vương quốc.',
            'protagonist': 'Rooster Knight - Hiệp Sĩ Gà (Mào đỏ rực lửa, áo choàng lông vũ trắng bạc, cựa kiếm ánh lam chém đứt mọi tơ nhện).',
            'antagonists': 'Bọ Gai Bay Lao Xiên, Cào Cào Kiếm Sĩ Song Đao, Bọ Hung Giáp Sắt Húc Điên, Nữ Hoàng Nhện Dệt Gai (Trùm Cuối).',
            'environment': 'Hang Động Rêu Phong Phát Sáng, Bãi Gai Nhọn Chết Chóc, Lâu Đài Tơ Vàng, Tháp Chuông Cổ Đại.',
            'gameplay_elements': 'Chém Kiếm Cựa 4 hướng, Nhảy Đạp Pogo nảy người trên đầu quái & gai nhọn, Lướt bóng mờ (Dash) né đòn, Khâu tơ hồi máu (Bind Heal), Ngồi ghế đá Checkpoint.'
        }
        
        hero_asset = g['assets'][0]
        hero_asset['name'] = '1. Hiệp Sĩ Gà (Rooster Knight - Main Hero)'
        
        new_assets = [
            hero_asset,
            {
                "id": "rk_monster_needle_beetle",
                "name": "2. Bọ Gai Bay Lao Xiên (Needle Beetle Flyer - Monster)",
                "category": "monsters",
                "format": "video",
                "format_reason": "Quái vật bay lơ lửng trên không và lao bổ xuống xiên gai như Mosquito trong Silksong -> Dùng Video AI bóc 6 frame",
                "priority": "Cao",
                "status": "pending",
                "animations": ["hover_idle", "dive_sting", "death_splat"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Bọ Gai Bay Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo ảnh con bọ giáp bay có gai nhọn dài ở mồm, cánh phát sáng ma thuật trên phông xanh",
                        "prompt": "2D side-view pixel art flying beetle monster with glowing cyan wings, sharp rapier needle stinger beak, dark gothic shell, Hollow Knight Silksong style, clean outlines, solid bright green chroma key background",
                        "action_description_vi": "Ảnh tĩnh góc nhìn ngang của con bọ gai bay cánh tím phát sáng xanh ngọc, mỏ có mũi gai nhọn hoắt như thanh kiếm liễu trên nền xanh lá cây thuần nhất.",
                        "cut_guide_vi": "Lưu file để làm ảnh gốc nạp vào Video AI (I2V) ở các bước tiếp theo.",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [hover_idle] (Bay Lơ Lửng Đập Cánh)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo chuyển động đập cánh lơ lửng tại chỗ",
                        "prompt": "Floating flying insect beetle hovering in place smoothly with rapid fluttering glowing wings, bobbing up and down gently, 6 frames seamless loop, fixed side view, solid bright green screen background",
                        "action_description_vi": "Con bọ đập cánh nhanh lơ lửng, thân mình nhấp nhô nhẹ nhàng trên không trung theo chu kỳ lặp.",
                        "cut_guide_vi": "Cắt 1 chu kỳ nhấp nhô lên xuống trọn vẹn (khoảng 0.6s - 0.8s) ➔ Bật nút [🪃 Ping-Pong Loop] để bay lặp mượt mà.",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.2: Video [dive_sting] (Lao Bổ Xuống Đâm Gai)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo đòn lao xiên chớp nhoáng về phía trước",
                        "prompt": "Flying needle beetle charging and diving steeply downward forward with sharp needle thrust attack, intense strike motion, 6 frames, fixed side view, solid bright green screen background",
                        "action_description_vi": "Bọ khựng lại 1 nhịp trên không ➔ Lao vụt chéo xuống dưới đâm mũi gai sắc lẹm về phía trước ➔ Hãm phanh quay lại tư thế bay.",
                        "cut_guide_vi": "Bắt đầu từ lúc bọ ngửa người lấy đà ➔ Kết thúc khi mũi gai đâm hết biên độ (khoảng 0.5s - 0.7s). Bỏ cờ 'Loop'.",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Bọ Gai & Hiệu Ứng Vỡ Giáp",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Ảnh lưới các dáng bay, đâm gai và nổ vỡ khi bị hiệp sĩ chém",
                        "prompt": "2D pixel art needle beetle spritesheet: hovering wings, needle dive attack, shell break death explosion, glowing purple soul essence, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_monster_mantis_blade",
                "name": "3. Cào Cào Kiếm Sĩ Song Đao (Mantis Blade Hunter - Monster)",
                "category": "monsters",
                "format": "video",
                "format_reason": "Kiếm sĩ bọ ngựa đứng gác, vung song đao chém 2 nhát chớp nhoáng và nhảy lùi né đòn -> Video AI bóc 8 frame",
                "priority": "Cao",
                "status": "pending",
                "animations": ["guard_idle", "blade_slash_combo", "backstep_dodge", "death"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Cào Cào Kiếm Sĩ Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo ảnh kiếm sĩ bọ ngựa áo choàng tơ lụa cầm song đao sắc bén trên phông xanh",
                        "prompt": "2D side-view pixel art mantis warrior swordsman wearing ragged dark silk cloak, holding two glowing curved blade scythes in battle stance, gothic insect knight, clean outlines, solid bright green chroma key background",
                        "action_description_vi": "Ảnh tĩnh góc nhìn ngang của hiệp sĩ cào cào đứng thủ thế, 2 tay cầm 2 lưỡi đao cong hình trăng khuyết, áo choàng rách bay nhẹ trong gió trên nền xanh lá.",
                        "cut_guide_vi": "Lưu file làm ảnh gốc nạp vào I2V cho các thế chém combo và nhảy lùi.",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [blade_slash_combo] (Chém Song Đao 2 Nhát)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo đòn chém chéo liên hoàn 2 nhát",
                        "prompt": "Mantis insect swordsman performing fierce double slash attack with dual curved scythe blades, swinging blades with white arc trails, 8 frames animation, fixed side view, solid bright green screen background",
                        "action_description_vi": "Kiếm sĩ vung đao phải chém chéo xuống ➔ Xoay người vung tiếp đao trái chém ngang tạo 2 vệt sáng hình bán nguyệt ➔ Thu đao về thủ thế.",
                        "cut_guide_vi": "Cắt từ lúc vung tay đầu tiên (0.1s) đến khi kết thúc nhát chém thứ 2 (khoảng 0.8s - 1.0s). Bỏ cờ 'Loop'.",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.2: Video [guard_idle] (Đứng Thủ Thế Thở)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo cử động đứng gác cảnh giác",
                        "prompt": "Mantis warrior standing in ready combat guard pose, cloak swaying slightly, breathing rhythmically, 6 frames loop, fixed side view, solid bright green screen background",
                        "action_description_vi": "Cào cào đứng hạ thấp trọng tâm, 2 lưỡi đao giơ trước ngực, áo choàng phấp phới nhẹ nhàng theo gió.",
                        "cut_guide_vi": "Cắt 1 chu kỳ thở 0.8s - 1.0s ➔ Dùng nút [🪃 Ping-Pong Loop] trong Tab 2.",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Trọn Bộ Kiếm Sĩ Cào Cào",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet lưới chuẩn bị các tư thế đỡ đòn (Parry) và gục ngã",
                        "prompt": "2D pixel art mantis warrior spritesheet: guard stance, dual slash combo with white blade arcs, parry block shield, hurt knockback, sliced in half death, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_monster_iron_tusk_brute",
                "name": "4. Bọ Hung Giáp Sắt Húc Điên (Iron Shell Brute - Mini-Boss)",
                "category": "monsters",
                "format": "video",
                "format_reason": "Quái thú giáp dày dộng đất và húc điên cuồng ủi người chơi, người chơi phải nhảy đạp cựa (Pogo) qua đầu -> Video AI",
                "priority": "Cao",
                "status": "pending",
                "animations": ["walk_heavy", "ground_slam", "charge_ram", "stunned_wall_crash"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Bọ Hung Giáp Sắt Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo ảnh bọ hung khổng lồ sừng kim loại, giáp lưng gai góc hầm hố",
                        "prompt": "2D side-view giant heavy armored rhinoceros beetle beast with massive iron spiked horn, heavy obsidian shell, menacing red glowing eyes, clean pixel art, solid bright green chroma key background",
                        "action_description_vi": "Quái thú bọ hung khổng lồ toàn thân bọc giáp đá hắc diện thạch, trên đầu có chiếc sừng kim loại khổng lồ chĩa về phía trước.",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [charge_ram] (Húc Điên Cuồng Về Phía Trước)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo cử động húc ủi ầm ầm",
                        "prompt": "Giant armored rhinoceros beetle beast charging furiously forward with lowered iron horn, heavy stomping footsteps and smoke, 8 frames continuous loop, fixed side view, solid bright green screen background",
                        "action_description_vi": "Bọ hung chúi đầu sừng xuống đất, 4 chân guồng mạnh mẽ lao vụt về phía trước như một cỗ xe tăng ủi bay mọi vật cản.",
                        "cut_guide_vi": "Lấy đoạn húc tốc độ cao ổn định 8 frame (khoảng 0.6s - 0.8s).",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Bọ Hung & Choáng Váng",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet dộng đất làm rơi đá và cảnh đâm đầu vào tường bị choáng",
                        "prompt": "2D pixel art heavy beetle brute spritesheet: heavy foot stomp ground slam, charge ramming pose, stunned dizzy stars after hitting wall, broken armor defeat, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_boss_spider_queen",
                "name": "5. Nữ Hoàng Nhện Dệt Gai (Silk Weaver Spider Queen - Main Boss)",
                "category": "monsters",
                "format": "video",
                "format_reason": "ĐẠI TRÙM SILKSONG: Leo trèo đu tơ nhện, giáng móng vuốt và phóng tơ gai chọc khắp màn hình -> Video AI 2-3s",
                "priority": "Cao",
                "status": "pending",
                "animations": ["web_hang_idle", "claw_slam_attack", "silk_needle_burst", "boss_defeat"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Boss Nữ Hoàng Nhện Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo ảnh Trùm Nhện Nữ Hoàng quý tộc ma mị đeo mặt nạ sứ trắng, váy tơ lụa đỏ thắm và 6 móng vuốt sắc nhọn",
                        "prompt": "2D side-view menacing spider queen boss wearing white porcelain mask, crimson silk gown, 6 long needle sharp spider legs, glowing red bioluminescent eyes, epic Silksong boss style, solid bright green screen background",
                        "action_description_vi": "Ảnh tĩnh góc nhìn ngang của Nữ Hoàng Nhện ma mị: Thân trên thon thả đeo mặt nạ sứ bí ẩn, thân dưới là 6 móng vuốt tơ nhện sắc như dao lam trên nền xanh lá.",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [claw_slam_attack] (Giáng Móng Vuốt Sấm Sét)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo đòn móng vuốt cắm phập xuống đất",
                        "prompt": "Spider queen boss rearing up on hind legs and slamming front massive needle claws violently into the ground with shockwave, 8 frames animation, fixed side view, solid bright green screen background",
                        "action_description_vi": "Nữ hoàng nhện dựng đứng người lên ➔ 2 móng vuốt trước giáng mạnh xuống đất tạo sóng xung kích rung chuyển hang động ➔ Rút móng vuốt về.",
                        "cut_guide_vi": "Cắt từ lúc giương móng vuốt lên cao đến lúc cắm đất tạo chấn động (khoảng 0.8s - 1.1s).",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Boss Trọn Bộ Chiêu Thức",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet các chiêu phun lưới tơ, phóng gai nhện và cảnh gục ngã phát nổ tơ lụa",
                        "prompt": "2D pixel art spider queen boss spritesheet: web hanging stance, needle claw ground slam with shockwave, shooting glowing silk threads, mask cracking defeat animation, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_vfx_feather_slash_arcs",
                "name": "6. Vệt Chém Lông Vũ & Bật Nhảy Pogo (Feather Slash Arcs & Pogo Strike VFX)",
                "category": "vfx",
                "format": "video",
                "format_reason": "Vệt chém lưỡi liềm trắng bạc ánh xanh khi gà vung cựa và vệt chém hướng xuống để Pogo nảy lên đầu quái -> Video AI",
                "priority": "Cao",
                "status": "pending",
                "animations": ["slash_arc_horizontal", "pogo_down_slash", "metal_spark_burst"],
                "pipeline_steps": [
                    {
                        "step_name": "🎬 Bước 1: Video Vệt Chém Lưỡi Liềm Sắc Lẹm (Slash Arc VFX)",
                        "tool_recommended": "Tencent HY Video 1.5 / Runway",
                        "purpose": "Tạo vệt sáng lưỡi liềm bán nguyệt quét ngang kèm lông vũ trắng phát sáng trên nền đen",
                        "prompt": "2D pixel art sharp crescent sword slash arc with glowing white and cyan light trail, scattering feather particles, fast horizontal swing, solid black background, VFX animation",
                        "action_description_vi": "Vệt chém hình trăng khuyết màu trắng bạc ánh xanh ngọc lóe lên trong chớp mắt kèm các hạt lông vũ phát sáng tung bay trên nền đen thuần khiết.",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 2: Spritesheet Tia Lửa & Vệt Chém Pogo",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet vệt chém hướng xuống (Down Slash Pogo) và chùm tia lửa kim loại khi chém trúng quái",
                        "prompt": "2D pixel art combat VFX spritesheet: downward sword slash arc for pogo jump, sharp glowing white blade swipe, yellow and orange impact sparks explosion, solid black background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_vfx_dash_ghost_trail",
                "name": "7. Hiệu Ứng Lướt Bóng Mờ & Lốc Xoáy Lông (Feather Dash Trail & Cyclone Burst VFX)",
                "category": "vfx",
                "format": "video",
                "format_reason": "Hiệu ứng bóng mờ lướt gió (Dash) né đòn và lốc xoáy lông vũ khi tung tuyệt chiêu nộ -> Video AI",
                "priority": "Cao",
                "status": "pending",
                "animations": ["dash_smoke_trail", "feather_cyclone_burst"],
                "pipeline_steps": [
                    {
                        "step_name": "🎬 Bước 1: Video Hiệu Ứng Lướt Gió Bóng Mờ (Dash Trail VFX)",
                        "tool_recommended": "Tencent HY Video 1.5 / Runway",
                        "purpose": "Tạo vệt gió lướt nhanh ngang màn hình có bóng mờ màu lam trên nền đen",
                        "prompt": "2D pixel art speed dash wind trail with glowing cyan smoke lines and fading motion blur silhouettes, fast horizontal burst, solid black background, VFX animation",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 2: Spritesheet Vụ Nổ Lốc Xoáy Lông Vũ",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Hiệu ứng nộ chiêu vỗ cánh tạo lốc xoáy quét sạch quái vật xung quanh",
                        "prompt": "2D pixel art magical feather cyclone burst explosion spritesheet, swirling glowing white feathers tornado, shockwave rings, solid black background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_env_ancient_cavern_tileset",
                "name": "8. Tileset Hang Động Rêu & Bãi Gai Nhọn (Mossy Cavern & Hazard Spikes Tileset)",
                "category": "environments",
                "format": "image",
                "format_reason": "Toàn bộ gạch nền mặt đất đá cổ, rêu phát sáng, bệ đá nhảy parkour và bãi gai nhọn chướng ngại vật -> Dạng Ảnh chuẩn lưới 16-bit",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_tiles", "spikes_hazard", "breakable_wall"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Tileset Hang Động Đá Cổ & Nấm Phát Sáng",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo bộ gạch mặt đất đá xám phủ rêu xanh ngọc phát sáng, bệ đá treo lơ lửng, cọc gai nhọn chết chóc, thạch nhũ trần hang ghép nối liền mạch",
                        "prompt": "2D modular pixel art metroidvania cavern tileset: dark mossy stone ground tiles with glowing cyan bioluminescent moss, floating stone platforms, sharp crystal hazard spikes, hanging stalactites, breakable cracked wall tiles, seamless grid, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_env_gilded_citadel_tileset",
                "name": "9. Tileset Thành Phố Tơ Vàng & Tháp Chuông Cổ (Gilded Silk Spire Palace Tileset)",
                "category": "environments",
                "format": "image",
                "format_reason": "Môi trường Màn 2: Kiến trúc cung điện đá hoa cương viền vàng, tơ lụa giăng ngang phong cách Silksong -> Dạng Ảnh chuẩn lưới",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_palace_tiles", "lantern_glow"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Tileset Lâu Đài Tơ Vàng & Đèn Lồng Cổ",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo gạch sàn đá cẩm thạch viền vàng son, cột trụ điêu khắc cổ xưa, rèm tơ nhện vàng óng, đèn lồng đung đưa phát sáng",
                        "prompt": "2D modular pixel art gothic castle tileset: polished marble floor tiles with gilded gold trim, ornate carved stone pillars, hanging golden silk tapestries, glowing ornate street lanterns, gothic window arches, seamless grid, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_items_bench_flask_relics",
                "name": "10. Ghế Đá Nghỉ Chân & Bình Tinh Chất Lông Vũ (Bench Checkpoint & Soul Feather Flask)",
                "category": "items",
                "format": "image",
                "format_reason": "Ghế đá cổ để ngồi nghỉ lưu game hồi máu (Bench), bình tinh chất phát sáng và các mảnh huy hiệu cổ (Charms) -> Dạng Ảnh Spritesheet",
                "priority": "Cao",
                "status": "pending",
                "animations": ["bench_sit_rest", "flask_shining", "relic_pickup"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Spritesheet Ghế Đá Checkpoint & Cổ Vật Tăng Lực",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo chiếc ghế đá rêu phong có chiếc đèn lồng treo phát sáng ấm áp, bình thủy tinh chứa giọt tơ năng lượng, 4 huy hiệu phù văn cổ (Charms) tăng tốc độ chém",
                        "prompt": "2D pixel art metroidvania interactive items: ornate carved stone bench checkpoint with glowing hanging lantern, glowing glass soul flask with liquid essence, 4 ancient rune charms and badges, shiny silver keys, treasure chest, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_ui_silksong_hud",
                "name": "11. Bộ Giao Diện Máu Mào Gà & Cuộn Tơ Năng Lượng (Silksong Silk Spool HUD & UI Kit)",
                "category": "ui",
                "format": "image",
                "format_reason": "Giao diện thanh máu hình mào gà phát sáng, cuộn tơ tích năng lượng để khâu vá hồi máu (Bind Heal), bảng Boss Bar uy lực -> Dạng Ảnh giao diện",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_hud", "health_loss_flash", "boss_health_bar"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Bộ UI Kit Chuẩn Metroidvania Silksong",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo khung thanh máu mào gà đỏ phát sáng, cuộn tơ lụa năng lượng hình tròn xoay, 3 ô trang bị kỹ năng phụ (Bẫy gai / Dao găm lông vũ), thanh máu Boss dài viền bạc uy nghi",
                        "prompt": "2D pixel art metroidvania HUD kit: glowing crimson rooster comb health masks, ornate circular silk spool energy gauge, 3 sub-weapon tool diamond slots, ornate silver boss health bar with skull crest, dialogue text box frame, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_env_parallax_depth_layers",
                "name": "12. Cảnh Nền Parallax Chiều Sâu Hang Động & Tòa Tháp (4-Layer Metroidvania Parallax Background)",
                "category": "environments",
                "format": "image",
                "format_reason": "Cảnh nền 4 lớp trôi độc lập tạo chiều sâu hun hút ma mị cho hang động và lâu đài -> Dạng Ảnh tách lớp",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_parallax"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Parallax 4 Lớp Chiều Sâu Hang Động Gothic",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo 4 lớp ảnh: Lớp 1 (Ánh trăng huyền ảo rọi qua khe đá xa xăm), Lớp 2 (Rừng cột đá tơ giăng tím mờ), Lớp 3 (Rặng nấm phát sáng xanh ngọc), Lớp 4 (Dây leo và thạch nhũ tiền cảnh)",
                        "prompt": "2D side-scrolling parallax background layers for gothic metroidvania cave: layer 1 deep blue moonlight shining through distant cavern chasm, layer 2 distant purple stalactite pillars silhouette with spiderwebs, layer 3 glowing cyan mushroom grottos, layer 4 foreground hanging vines and water drops, seamless loop",
                        "completed": False
                    }
                ]
            }
        ]
        g['assets'] = new_assets

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print('SUCCESSFULLY_UPDATED_SILKSONG_PIPELINE')
