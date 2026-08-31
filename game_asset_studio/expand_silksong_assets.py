import json

db_path = r'd:\folder\tools\game_asset_studio\game_projects.json'
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

for g in db['games']:
    if g['id'] == 'game_crossy_rooster':
        g['title'] = 'Rooster Knight: Feather Song (Silksong Metroidvania)'
        g['genre'] = '2D Action Metroidvania & Fast-Paced Platformer (Hollow Knight / Silksong Style)'
        g['art_style'] = '16-Bit Bioluminescent Gothic Pixel Art, Rich Multi-Layer Parallax, Living Ecosystem'
        g['raw_input_story'] = 'Thế giới ngầm Phantasmagoria kỳ ảo đa dạng 5 Biome: Hang Rêu Nấm Phát Sáng, Lâu Đài Tơ Vàng, Xưởng Rèn Dung Nham, Rừng Hoa Pha Lê và Đầm Lầy Axit. Hiệp sĩ gà lướt chém, pogo nhún nảy, tương tác môi trường sống động và chinh phục các Đại Trùm.'
        g['full_story'] = {
            'synopsis': 'Vương quốc ngầm Phantasmagoria ngập tràn bí ẩn với 5 đại khu vực huyền ảo. Hiệp Sĩ Gà (Rooster Knight) thức tỉnh mang theo thanh cựa kiếm ánh lam, phiêu lưu qua các tầng hang động rực rỡ nấm dạ quang, đu bám qua các chùm đèn lồng tơ lụa đung đưa, khám phá các đền thờ cổ kính và đánh bại thế lực Bóng Đêm Dệt Tơ.',
            'protagonist': 'Rooster Knight - Hiệp Sĩ Gà Thượng Cổ (Mào đỏ lửa, áo choàng lông vũ bạc, cựa kiếm ánh lam chém đứt mọi kết giới).',
            'antagonists': 'Bọ Gai Bay, Cào Cào Kiếm Sĩ, Sâu Gai Lăn Tròn, Pháp Sư Bướm Đêm, Nữ Hoàng Nhện Dệt Gai (Trùm Tơ Lụa), Vua Rận Dung Nham (Trùm Lửa).',
            'environment': '5 Biome Đa Tầng: 1. Hang Động Rêu Nấm Dạ Quang, 2. Lâu Đài Tơ Vàng & Tháp Chuông, 3. Xưởng Rèn Dung Nham Rực Lửa, 4. Vườn Hoa Pha Lê Ánh Trăng, 5. Đầm Lầy Axit & Kén Nhện Cổ.',
            'gameplay_elements': 'Pogo Đạp Cựa nảy bổng trên đầu quái & nấm đàn hồi, Lướt gió bóng mờ (Dash), Nhảy bám tường móng vuốt (Claw Wall Climb), Khâu tơ hồi máu (Bind Heal), Tương tác vật thể môi trường đung đưa & phá hủy.'
        }
        
        hero_asset = g['assets'][0]
        hero_asset['name'] = '1. Hiệp Sĩ Gà (Rooster Knight - Main Hero)'
        
        all_silksong_assets = [
            hero_asset,
            
            # --- [NHÓM 1: QUÁI VẬT & BOSSES] ---
            {
                "id": "rk_monster_needle_beetle",
                "name": "2. Bọ Gai Bay Lao Xiên (Needle Beetle Flyer - Monster)",
                "category": "monsters",
                "format": "video",
                "format_reason": "Quái vật bay lơ lửng trên không và lao bổ xuống xiên gai -> Video AI bóc 6 frame",
                "priority": "Cao",
                "status": "pending",
                "animations": ["hover_idle", "dive_sting", "death_splat"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Bọ Gai Bay Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo ảnh con bọ giáp bay có gai nhọn dài ở mồm, cánh phát sáng ma thuật trên phông xanh",
                        "prompt": "2D side-view pixel art flying beetle monster with glowing cyan wings, sharp rapier needle stinger beak, dark gothic shell, Hollow Knight Silksong style, clean outlines, solid bright green chroma key background",
                        "action_description_vi": "Ảnh tĩnh góc nhìn ngang của con bọ gai bay cánh tím phát sáng xanh ngọc trên nền xanh lá cây.",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [hover_idle] (Bay Lơ Lửng Đập Cánh)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo chuyển động đập cánh lơ lửng tại chỗ",
                        "prompt": "Floating flying insect beetle hovering in place smoothly with rapid fluttering glowing wings, bobbing up and down gently, 6 frames seamless loop, fixed side view, solid bright green screen background",
                        "action_description_vi": "Con bọ đập cánh nhanh lơ lửng, thân mình nhấp nhô nhẹ nhàng theo chu kỳ lặp.",
                        "cut_guide_vi": "Cắt 1 chu kỳ nhấp nhô lên xuống trọn vẹn (khoảng 0.6s - 0.8s) ➔ Bật nút [🪃 Ping-Pong Loop].",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.2: Video [dive_sting] (Lao Bổ Đâm Gai)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo đòn lao xiên chớp nhoáng",
                        "prompt": "Flying needle beetle charging and diving steeply downward forward with sharp needle thrust attack, intense strike motion, 6 frames, fixed side view, solid bright green screen background",
                        "action_description_vi": "Bọ khựng lại 1 nhịp trên không ➔ Lao vụt chéo xuống dưới đâm mũi gai sắc lẹm.",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Bọ Gai & Nổ Vỡ Giáp",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Ảnh lưới các dáng bay, đâm gai và nổ vỡ",
                        "prompt": "2D pixel art needle beetle spritesheet: hovering wings, needle dive attack, shell break death explosion, transparent background",
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
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [blade_slash_combo] (Chém Song Đao 2 Nhát)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo đòn chém chéo liên hoàn 2 nhát",
                        "prompt": "Mantis insect swordsman performing fierce double slash attack with dual curved scythe blades, swinging blades with white arc trails, 8 frames animation, fixed side view, solid bright green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.2: Video [guard_idle] (Đứng Thủ Thế Thở)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo cử động đứng gác cảnh giác",
                        "prompt": "Mantis warrior standing in ready combat guard pose, cloak swaying slightly, breathing rhythmically, 6 frames loop, fixed side view, solid bright green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Trọn Bộ Kiếm Sĩ Cào Cào",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet lưới chuẩn bị các tư thế đỡ đòn và gục ngã",
                        "prompt": "2D pixel art mantis warrior spritesheet: guard stance, dual slash combo with white blade arcs, parry block shield, hurt knockback, death, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_monster_spiked_roller",
                "name": "4. Sâu Gai Bọc Giáp Lăn Tròn (Armored Spiked Pillbug - Monster)",
                "category": "monsters",
                "format": "video",
                "format_reason": "Quái vật bò chậm rồi cuộn tròn thành quả cầu gai lăn qua lại trên mặt đất -> Video AI bóc 8 frame",
                "priority": "Cao",
                "status": "pending",
                "animations": ["crawl_walk", "curl_into_ball", "roll_attack_loop", "uncurl_bounce"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Sâu Bọc Giáp Gai Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo ảnh chú sâu giáp nhiều khúc có gai nhọn trên lưng, màu tím đen bóng bẩy",
                        "prompt": "2D side-view pixel art segmented armored pillbug crawler with obsidian spiked shell, glowing purple underbelly, clean pixel outlines, solid bright green chroma key background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [roll_attack_loop] (Lăn Tròn Gai Tốc Độ Cao)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo quả cầu gai xoay tít lăn băng băng",
                        "prompt": "Armored spiked pillbug curled completely into a spinning spiked ball rolling fast along the ground with dust sparks, 8 frames continuous loop, fixed side view, solid green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Sâu Gai Bò & Cuộn Tròn",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Ảnh lưới bò, cuộn tròn, lăn và va vào tường dội ngược lại",
                        "prompt": "2D pixel art spiked roller bug spritesheet: crawling walk cycle, curl into sphere transition, fast rolling loop, bounce back impact, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_monster_moth_sorcerer",
                "name": "5. Pháp Sư Bướm Đêm Triệu Hồi Tơ Sét (Moth Silk Sorcerer - Elite Monster)",
                "category": "monsters",
                "format": "video",
                "format_reason": "Quái tinh anh bay lơ lửng niệm chú phóng quả cầu tơ sét và dịch chuyển tức thời -> Video AI bóc 8 frame",
                "priority": "Cao",
                "status": "pending",
                "animations": ["hover_cast", "silk_bolt_shoot", "teleport_fade", "teleport_appear"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Pháp Sư Bướm Đêm Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo ảnh phù thủy bướm đêm mang áo choàng lông vũ dài, tay cầm quyền trượng tơ lụa phát sáng",
                        "prompt": "2D side-view gothic moth sorcerer with large fluffy white moth wings, dark royal purple wizard robes, holding glowing golden staff, floating in air, clean outlines, solid bright green chroma key background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [hover_cast] (Lơ Lửng Niệm Chú Phóng Tơ)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo cử động giơ gậy niệm chú tỏa ánh hào quang",
                        "prompt": "Moth sorcerer hovering gracefully in air, raising glowing golden staff and casting magical runes with swirling silk light particles, 8 frames loop, fixed side view, solid green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Pháp Sư & Quả Cầu Tơ Sét",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet niệm phép, bắn đạn ma thuật và tan biến dịch chuyển",
                        "prompt": "2D pixel art moth sorcerer spritesheet: floating cast, shooting glowing silk lightning orbs, vanishing into glowing dust teleport, hurt, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_monster_iron_tusk_brute",
                "name": "6. Bọ Hung Giáp Sắt Húc Điên (Iron Shell Brute - Mini-Boss)",
                "category": "monsters",
                "format": "video",
                "format_reason": "Quái thú giáp dày dộng đất và húc điên cuồng ủi người chơi (phải nhảy Pogo đạp đầu) -> Video AI",
                "priority": "Cao",
                "status": "pending",
                "animations": ["walk_heavy", "ground_slam", "charge_ram", "stunned_wall_crash"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Bọ Hung Giáp Sắt Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo ảnh bọ hung khổng lồ sừng kim loại, giáp lưng gai góc",
                        "prompt": "2D side-view giant heavy armored rhinoceros beetle beast with massive iron spiked horn, heavy obsidian shell, menacing red glowing eyes, clean pixel art, solid bright green chroma key background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [charge_ram] (Húc Điên Cuồng Về Phía Trước)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo cử động húc ủi ầm ầm",
                        "prompt": "Giant armored rhinoceros beetle beast charging furiously forward with lowered iron horn, heavy stomping footsteps and smoke, 8 frames continuous loop, fixed side view, solid bright green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Bọ Hung & Choáng Váng",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet dộng đất và cảnh đâm đầu vào tường bị choáng",
                        "prompt": "2D pixel art heavy beetle brute spritesheet: ground slam stomp, charge ramming, stunned stars, defeat, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_boss_spider_queen",
                "name": "7. Nữ Hoàng Nhện Dệt Gai (Silk Weaver Spider Queen - Main Boss 1)",
                "category": "monsters",
                "format": "video",
                "format_reason": "ĐẠI TRÙM VÙNG TƠ LỤA: Leo trèo đu tơ nhện, giáng móng vuốt và phóng tơ gai chọc khắp màn hình -> Video AI",
                "priority": "Cao",
                "status": "pending",
                "animations": ["web_hang_idle", "claw_slam_attack", "silk_needle_burst", "boss_defeat"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Boss Nữ Hoàng Nhện Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo ảnh Trùm Nhện Nữ Hoàng quý tộc ma mị đeo mặt nạ sứ trắng, váy tơ lụa đỏ thắm và 6 móng vuốt sắc nhọn",
                        "prompt": "2D side-view menacing spider queen boss wearing white porcelain mask, crimson silk gown, 6 long needle sharp spider legs, glowing red bioluminescent eyes, epic Silksong boss style, solid bright green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [claw_slam_attack] (Giáng Móng Vuốt Sấm Sét)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo đòn móng vuốt cắm phập xuống đất",
                        "prompt": "Spider queen boss rearing up on hind legs and slamming front massive needle claws violently into the ground with shockwave, 8 frames animation, fixed side view, solid bright green screen background",
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
                "id": "rk_boss_magma_forge_king",
                "name": "8. Vua Rận Dung Nham & Lò Rèn Thượng Cổ (Magma Forge King - Main Boss 2)",
                "category": "monsters",
                "format": "video",
                "format_reason": "ĐẠI TRÙM VÙNG LÒ RÈN DUNG NHAM: Toàn thân rực lửa, quai búa tạ khổng lồ tạo sóng dung nham dâng trào -> Video AI",
                "priority": "Cao",
                "status": "pending",
                "animations": ["forge_hammer_smash", "magma_eruption_roar", "molten_body_glow", "boss_defeat_extinguish"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Boss Vua Dung Nham Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Ảnh trùm quái thú đá nham thạch nứt nẻ phát sáng đỏ rực, tay cầm búa rèn khổng lồ bốc khói",
                        "prompt": "2D side-view colossal molten lava rock forge king monster, cracked volcanic shell glowing with molten magma, wielding giant glowing iron anvil warhammer, billowing dark smoke, solid bright green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [forge_hammer_smash] (Quai Búa Tạ Nổ Dung Nham)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo đòn nện búa xuống đất phụt trào nham thạch",
                        "prompt": "Colossal magma rock beast slamming massive glowing iron hammer onto ground with exploding fire sparks and molten lava geysers, 8 frames animation, fixed side view, solid green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Boss Dung Nham",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet quai búa, gầm rú phun lửa và hóa đá khi bị hạ gục",
                        "prompt": "2D pixel art magma forge boss spritesheet: hammer overhead smash, lava roar breath, fiery shockwave ground cracks, stone turning grey defeat, transparent background",
                        "completed": False
                    }
                ]
            },

            # --- [NHÓM 2: NPCS & BẠN ĐỒNG HÀNH SỐNG ĐỘNG] ---
            {
                "id": "rk_npc_turtle_blacksmith",
                "name": "9. Cụ Rùa Thợ Rèn Cổ Thụ (Old Turtle Master Blacksmith - NPC)",
                "category": "characters",
                "format": "video",
                "format_reason": "NPC thợ rèn ngồi bên đe đá gõ búa nâng cấp cựa kiếm, râu tóc phất phơ, tẩu thuốc bốc khói -> Video AI bóc 8 frame",
                "priority": "Cao",
                "status": "pending",
                "animations": ["hammer_anvil_loop", "smoke_pipe_talk", "proud_inspect"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Cụ Rùa Thợ Rèn Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Ảnh cụ rùa già râu dài bạc trắng mang tạp dề da, ngồi trước đe đá thần thoại cầm búa",
                        "prompt": "2D side-view wise old turtle blacksmith with long white beard, wearing leather apron, holding small hammer over glowing anvil, cozy friendly Silksong NPC, clean outlines, solid bright green chroma key background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [hammer_anvil_loop] (Gõ Búa Rèn Kiếm Nhịp Nhàng)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo chu kỳ gõ búa tít tắc tóe tia lửa vàng",
                        "prompt": "Wise old turtle blacksmith tapping hammer rhythmically onto glowing anvil with little golden spark flashes, blinking eyes and nodding head, 8 frames continuous loop, fixed side view, solid green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Cụ Rùa Thợ Rèn & Lò Than",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet gõ búa, rít tẩu thuốc nói chuyện và kiểm tra kiếm",
                        "prompt": "2D pixel art turtle blacksmith NPC spritesheet: hammer strike loop with spark particles, puffing smoke pipe dialogue emote, smiling proud nod, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_npc_moth_cartographer",
                "name": "10. Sâu Bướm Họa Sĩ Vẽ Bản Đồ (Moth Cartographer & Quill - NPC)",
                "category": "characters",
                "format": "video",
                "format_reason": "NPC vẽ bản đồ ngồi ngâm nga hát, tay cầm bút lông viết lên cuộn giấy da bay lơ lửng -> Video AI",
                "priority": "Cao",
                "status": "pending",
                "animations": ["humming_draw_loop", "greeting_wave", "sell_map_handout"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Sâu Bướm Họa Sĩ Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Ảnh chú sâu bướm đeo kính cận tròn, đội mũ phớt, ngồi trên đống bản đồ cuộn tơ",
                        "prompt": "2D side-view adorable plump moth scholar cartographer wearing round spectacles, quill pen in hand, surrounded by parchment map scrolls, cozy NPC style, clean pixel art, solid bright green chroma key background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [humming_draw_loop] (Ngâm Nga Vẽ Bản Đồ)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo cử động đầu lắc lư ngâm nga và tay chấm mực viết",
                        "prompt": "Cute moth scholar happily humming and drawing with feather quill on scroll parchment, head swaying gently with musical notes, 8 frames continuous loop, fixed side view, solid green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Họa Sĩ & Trang Giấy Bay",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet vẽ tranh, vẫy tay chào hiệp sĩ và trao cuộn bản đồ",
                        "prompt": "2D pixel art moth cartographer spritesheet: humming drawing loop, waving greeting with quill, handing over glowing map scroll, transparent background",
                        "completed": False
                    }
                ]
            },

            # --- [NHÓM 3: 5 BIOME TILESETS & MAP MÔI TRƯỜNG] ---
            {
                "id": "rk_env_biome1_mossy_grotto_tileset",
                "name": "11. Biome 1: Tileset Hang Động Rêu Nấm Dạ Quang (Bioluminescent Moss Grotto Tileset)",
                "category": "environments",
                "format": "image",
                "format_reason": "Màn 1: Mặt đất đá cổ xám phủ rêu xanh ngọc phát sáng, bệ đá leo trèo, thạch nhũ và bãi gai nhọn -> Dạng Ảnh chuẩn lưới",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_tiles", "hazard_spikes", "breakable_wall"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Tileset Hang Động Rêu & Bãi Gai",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Bộ gạch mặt đất đá cổ, rêu xanh ngọc phát sáng bioluminescent, bệ đá nhảy parkour, cọc gai nhọn chết chóc, vách đá nứt có thể phá hủy",
                        "prompt": "2D modular pixel art metroidvania mossy cavern tileset: dark textured stone floor tiles with glowing cyan bioluminescent moss edge, floating rock platforms, sharp obsidian hazard spikes, breakable cracked wall tiles, hanging stalactites, seamless grid, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_env_biome2_gilded_citadel_tileset",
                "name": "12. Biome 2: Tileset Lâu Đài Tơ Vàng & Tháp Chuông (Gilded Silk Spire Palace Tileset)",
                "category": "environments",
                "format": "image",
                "format_reason": "Màn 2: Sàn đá cẩm thạch trắng viền vàng hoàng gia, cột trụ điêu khắc cổ, rèm tơ lụa vàng óng và tháp chuông -> Dạng Ảnh chuẩn lưới",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_palace_tiles", "gilded_pillars", "silk_curtains"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Tileset Lâu Đài Tơ Vàng Cẩm Thạch",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Sàn đá hoa cương viền vàng son, cột trụ điêu khắc phong cách Gothic, rèm tơ nhện vàng treo tường, lan can tháp chuông",
                        "prompt": "2D modular pixel art gilded castle tileset: polished white marble floor tiles with ornate gold inlay edges, carved gothic stone pillars, hanging golden silk banner tapestries, ornate bell tower railings, stained glass window arches, seamless grid, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_env_biome3_magma_forge_tileset",
                "name": "13. Biome 3: Tileset Xưởng Rèn Dung Nham & Xích Sắt (Magma Forge & Iron Smeltery Tileset)",
                "category": "environments",
                "format": "image",
                "format_reason": "Màn 3: Bề mặt đá nham thạch đen tuyền có rãnh dung nham đỏ rực phát sáng, bệ sắt xưởng đúc, xích treo khổng lồ -> Dạng Ảnh chuẩn lưới",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_forge_tiles", "lava_surface_animated", "iron_chains"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Tileset Nham Thạch & Lò Đúc Kim Loại",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Gạch đá núi lửa đen nứt rãnh nham thạch phát sáng, sàn kim loại lưới sắt rỉ sét, xích sắt khổng lồ, bồn chứa dung nham nguy hiểm",
                        "prompt": "2D modular pixel art volcanic magma forge tileset: dark basalt rock tiles with glowing orange molten lava cracks, rusty iron metal grate platforms, giant heavy hanging iron chain links, hot cinder hazard pits, seamless grid, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_env_biome4_crystal_spring_tileset",
                "name": "14. Biome 4: Tileset Vườn Hoa Pha Lê & Hồ Ánh Trăng (Crystalline Arboretum & Moonlit Spring Tileset)",
                "category": "environments",
                "format": "image",
                "format_reason": "Màn 4: Khối pha lê tím phát quang, mặt hồ nước trong vắt phản chiếu ánh trăng, thềm đá hoa đăng lung linh -> Dạng Ảnh chuẩn lưới",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_crystal_tiles", "moonlit_water_surface", "crystal_shards"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Tileset Pha Lê Tím & Hồ Nước Ánh Trăng",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Gạch thạch anh tím phát quang, bệ pha lê phản chiếu ánh sáng, thềm nước thiêng phục hồi năng lượng, hoa sen đá lung linh",
                        "prompt": "2D modular pixel art crystal cavern tileset: glowing purple amethyst crystal stone tiles, translucent crystal platforms, glowing moonlit healing water spring tiles, sparkling crystal flower sprouts, seamless grid, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_env_biome5_acid_cocoon_bog_tileset",
                "name": "15. Biome 5: Tileset Đầm Lầy Axit & Tổ Kén Cổ Xưa (Acid Bog & Silk Cocoon Nursery Tileset)",
                "category": "environments",
                "format": "image",
                "format_reason": "Màn 5: Vùng đất tơ nhện độc, hồ axit xanh lá sủi bọt, bệ kén nhện dẻo dai bám tường -> Dạng Ảnh chuẩn lưới",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_acid_tiles", "acid_bubble_hazard", "web_trampoline"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Tileset Đầm Lầy Axit & Tơ Nhện Độc",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Mặt đất bùn lầy bao phủ tơ nhện xám, hồ axit xanh lá sủi tăm độc hại, bệ tơ nhện đàn hồi có thể nhảy nảy",
                        "prompt": "2D modular pixel art acid swamp tileset: dark tangled spiderweb ground tiles, glowing green bubbling acid pool hazards, bouncy sticky silk web platforms, hanging cocoon pods, thorny poisonous vines, seamless grid, transparent background",
                        "completed": False
                    }
                ]
            },

            # --- [NHÓM 4: CẢNH NỀN PARALLAX ĐA TẦNG CHIỀU SÂU] ---
            {
                "id": "rk_parallax_cavern_depth_4layers",
                "name": "16. Parallax 4 Lớp: Hang Động Rêu Nấm Dạ Quang (Cavern 4-Layer Parallax Background)",
                "category": "environments",
                "format": "image",
                "format_reason": "Tách 4 lớp ảnh độc lập để tạo chiều sâu 3D cuộn mượt mà: Lớp xa (Hố trời ánh trăng), Lớp trung xa (Rừng cột đá tơ giăng), Lớp trung gần (Rặng nấm sáng), Lớp tiền cảnh (Dây leo & giọt nước) -> Dạng Ảnh tách lớp",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_parallax_layers"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Bộ 4 Lớp Parallax Chiều Sâu Hang Động",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo 4 lớp ảnh riêng biệt ghép cảnh nền cuộn vô tận cho Biome 1",
                        "prompt": "2D side-scrolling parallax background 4 separate layers for metroidvania glowing cave: Layer 1 deep blue moonlight shining through distant cavern chasm ceiling, Layer 2 silhouettes of massive stalactite pillars with spiderwebs, Layer 3 glowing cyan giant mushroom forest, Layer 4 dark hanging vines and water drops in foreground, seamless loop, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_parallax_citadel_skyline_4layers",
                "name": "17. Parallax 4 Lớp: Bầu Trời Hoàng Hôn Lâu Đài Tơ Vàng (Gilded Citadel 4-Layer Skyline)",
                "category": "environments",
                "format": "image",
                "format_reason": "Cảnh nền hoàng hôn tráng lệ: Lớp 1 (Mặt trời đỏ lặn sau mây tím), Lớp 2 (Rặng tháp chuông Gothic xa mờ), Lớp 3 (Cầu đá tơ lụa giăng ngang), Lớp 4 (Cột đèn vàng tiền cảnh) -> Dạng Ảnh tách lớp",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_parallax_layers"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Bộ 4 Lớp Parallax Thành Phố Tơ Vàng",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo 4 lớp ảnh chiều sâu hoàng hôn cho Biome 2",
                        "prompt": "2D side-scrolling parallax background 4 layers for gilded gothic silk city: Layer 1 sunset crimson and gold sky with clouds, Layer 2 silhouettes of majestic gothic cathedral spires and giant bells, Layer 3 elevated stone bridges with flowing silk banners, Layer 4 glowing street lanterns and gargoyle statues, seamless loop, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_parallax_magma_smeltery_4layers",
                "name": "18. Parallax 4 Lớp: Lò Rèn Dung Nham & Khói Lửa (Magma Smeltery 4-Layer Background)",
                "category": "environments",
                "format": "image",
                "format_reason": "Cảnh nền xưởng đúc rực lửa: Lớp 1 (Vòm nham thạch đỏ rực), Lớp 2 (Bánh răng & xích sắt khổng lồ), Lớp 3 (Thác dung nham chảy), Lớp 4 (Tia than hồng bay tiền cảnh) -> Dạng Ảnh tách lớp",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_parallax_layers"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Bộ 4 Lớp Parallax Xưởng Lò Rèn",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo 4 lớp ảnh khói lửa dung nham cho Biome 3",
                        "prompt": "2D side-scrolling parallax background 4 layers for subterranean magma forge: Layer 1 glowing red volcanic caldera cavern, Layer 2 silhouettes of massive industrial steam pipes and rotating giant gears, Layer 3 glowing orange molten lava waterfalls, Layer 4 rising dark smoke and floating glowing embers, seamless loop, transparent background",
                        "completed": False
                    }
                ]
            },

            # --- [NHÓM 5: VẬT THỂ MÔI TRƯỜNG CHUYỂN ĐỘNG SỐNG ĐỘNG (LIVING ANIMATED PROPS)] ---
            {
                "id": "rk_prop_animated_bouncy_mushroom",
                "name": "19. Nấm Nhún Nhảy Đàn Hồi (Animated Bouncy Mushroom Trampoline - Living Prop)",
                "category": "environments",
                "format": "video",
                "format_reason": "Vật thể tương tác quan trọng: Nấm khổng lồ nhún xuống khi gà nhảy lên hoặc chém trúng rồi bật bổng gà lên cao (Pogo) -> Video AI bóc 6 frame",
                "priority": "Cao",
                "status": "pending",
                "animations": ["idle_pulsing", "bounce_spring_up", "spore_burst_fx"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Nấm Bật Nhảy Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Tạo ảnh chiếc nấm khổng lồ mũ nấm dày bóng bẩy phát sáng xanh ngọc trên phông xanh",
                        "prompt": "2D side-view large plump bouncy trampoline mushroom with glowing turquoise spotted cap, flexible organic stem, clean pixel art, solid bright green chroma key background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [bounce_spring_up] (Nấm Nhún Xuống Nảy Bổng Lên)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo chuyển động ép lò xo nhún xuống rồi bung mạnh lên trên kèm bào tử sáng",
                        "prompt": "Large bouncy mushroom squashing down organically under heavy weight and then springing forcefully upward into original shape with tiny glowing spore sparks, 6 frames animation, fixed side view, solid green screen background",
                        "action_description_vi": "Mũ nấm bị ép dẹp xuống ➔ Đàn hồi bật mạnh vút lên trên tạo lực đẩy rồi trở về hình dáng cũ.",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Nấm Đàn Hồi",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Ảnh lưới nấm thở phập phồng, nhún ép dẹp và bung nảy đẩy nhân vật",
                        "prompt": "2D pixel art bouncy trampoline mushroom spritesheet: gentle pulsing idle, squash compress frame, spring stretch launch frame, spore dust puff, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_prop_animated_swaying_lantern",
                "name": "20. Đèn Lồng Tơ Lụa Đung Đưa Trong Gió (Animated Swaying Silk Lantern - Living Prop)",
                "category": "environments",
                "format": "video",
                "format_reason": "Đèn lồng treo đung đưa theo gió hoặc lắc lư dữ dội khi hiệp sĩ chém hoặc lướt qua -> Video AI bóc 8 frame",
                "priority": "Cao",
                "status": "pending",
                "animations": ["sway_wind_loop", "impact_swing_fast", "lantern_break_fire"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Đèn Lồng Tơ Treo Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Ảnh chiếc đèn lồng kim loại điêu khắc cổ treo bằng sợi tơ nhện vàng, ngọn lửa ấm áp bên trong",
                        "prompt": "2D hanging ornate gothic brass lantern suspended by a silk thread, glowing warm golden flame candle inside, clean pixel art, solid bright green chroma key background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [sway_wind_loop] (Đèn Lắc Lư Đung Đưa Mượt Mà)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo dao động con lắc đung đưa trái phải nhẹ nhàng",
                        "prompt": "Ornate brass hanging lantern swaying gently left and right like a pendulum in soft breeze with glowing light aura, 8 frames seamless loop, fixed camera, solid green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Đèn Lồng Đung Đưa",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet các góc nghiêng con lắc và hiệu ứng vỡ bốc lửa",
                        "prompt": "2D pixel art swaying hanging lantern spritesheet: pendulum swing cycle, fast recoil swing, glass shatter spark burst, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_prop_animated_pulsing_cocoon",
                "name": "21. Kén Tơ Phập Phồng & Phun Bào Tử (Pulsing Silk Cocoon & Spore Node - Living Prop)",
                "category": "environments",
                "format": "video",
                "format_reason": "Tổ kén tơ bám trần phập phồng như trái tim đập, chém vỡ sẽ rơi ra giọt tơ hồi máu (Soul Silk) -> Video AI bóc 6 frame",
                "priority": "Cao",
                "status": "pending",
                "animations": ["heartbeat_pulse_loop", "burst_drop_silk"],
                "pipeline_steps": [
                    {
                        "step_name": "📸 Bước 1: Tạo Dáng Kén Tơ Phát Sáng Phông Xanh",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Ảnh chiếc kén tơ nhện treo lơ lửng, bên trong phát sáng nhịp nhàng",
                        "prompt": "2D hanging glowing silk cocoon pod attached to ceiling web, pulsing soft purple inner light, organic insect nest, pixel art, solid bright green chroma key background",
                        "completed": False
                    },
                    {
                        "step_name": "🎬 Bước 2.1: Video [heartbeat_pulse_loop] (Kén Co Bóp Phập Phồng)",
                        "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                        "purpose": "Nạp ảnh Bước 1 tạo cử động co bóp phập phồng như nhịp tim",
                        "prompt": "Hanging silk cocoon pulsating rhythmically like a beating heart with glowing inner light fading in and out, 6 frames seamless loop, fixed camera, solid green screen background",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 3: Spritesheet Kén Nổ Rơi Tinh Chất",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet kén đập nhịp và vỡ tung giải phóng tơ lụa",
                        "prompt": "2D pixel art pulsing cocoon spritesheet: heartbeat expansion cycle, sliced open burst explosion, releasing glowing silk soul drops, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_prop_animated_dripping_stalactite",
                "name": "22. Thạch Nhũ Nhỏ Giọt Nước & Hơi Nước Bốc Lên (Dripping Stalactite & Steam Vent - Living Prop)",
                "category": "environments",
                "format": "video",
                "format_reason": "Thạch nhũ liên tục nhỏ giọt nước tạo vòng sóng lan tỏa trên mặt hồ, và lỗ thông hơi phì khói định kỳ -> Video AI",
                "priority": "Trung bình",
                "status": "pending",
                "animations": ["water_drop_fall_loop", "steam_puff_vent"],
                "pipeline_steps": [
                    {
                        "step_name": "🎬 Bước 1: Video Giọt Nước Rơi Tạo Gợn Sóng (Water Drop VFX)",
                        "tool_recommended": "Tencent HY Video 1.5 / Runway",
                        "purpose": "Tạo giọt nước trong suốt hình thành ở đầu nhọn thạch nhũ ➔ Rơi xuống đất nổ thành vòng sóng tròn",
                        "prompt": "2D pixel art water droplet forming at sharp stalactite tip, falling straight down and creating expanding circular ripple rings on puddle surface, 8 frames loop, solid black background",
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 2: Spritesheet Thạch Nhũ & Cột Khói Xì",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet giọt nước và cột khói hơi nước bốc lên định kỳ",
                        "prompt": "2D pixel art environmental props spritesheet: stalactite tip water drop cycle, water puddle ripple waves, volcanic steam vent puff, transparent background",
                        "completed": False
                    }
                ]
            },

            # --- [NHÓM 6: COMBAT VFX & KỸ NĂNG NÂNG CẤP] ---
            {
                "id": "rk_vfx_feather_slash_arcs",
                "name": "23. Vệt Chém Lông Vũ & Bật Nhảy Pogo (Feather Slash Arcs & Pogo Strike VFX)",
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
                        "completed": False
                    },
                    {
                        "step_name": "🖼️ Bước 2: Spritesheet Tia Lửa & Vệt Chém Pogo",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Spritesheet vệt chém hướng xuống (Down Slash Pogo) và chùm tia lửa va chạm kim loại",
                        "prompt": "2D pixel art combat VFX spritesheet: downward sword slash arc for pogo jump, sharp glowing white blade swipe, yellow impact sparks explosion, solid black background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_vfx_dash_ghost_trail",
                "name": "24. Hiệu Ứng Lướt Bóng Mờ & Lốc Xoáy Lông (Feather Dash Trail & Cyclone Burst VFX)",
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

            # --- [NHÓM 7: VẬT PHẨM, GIAO DIỆN & BẢN ĐỒ THẾ GIỚI] ---
            {
                "id": "rk_items_bench_flask_relics",
                "name": "25. Ghế Đá Nghỉ Chân & Bình Tinh Chất Lông Vũ (Bench Checkpoint & Soul Feather Flask)",
                "category": "items",
                "format": "image",
                "format_reason": "Ghế đá cổ để ngồi nghỉ lưu game hồi máu (Bench), bình tinh chất phát sáng và 8 huy hiệu cổ phù văn (Charms) -> Dạng Ảnh Spritesheet",
                "priority": "Cao",
                "status": "pending",
                "animations": ["bench_sit_rest", "flask_shining", "relic_pickup"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Spritesheet Ghế Đá Checkpoint & Cổ Vật Tăng Lực",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Ghế đá rêu phong có đèn lồng treo phát sáng ấm áp, bình thủy tinh tơ năng lượng, 8 huy hiệu phù văn cổ (Charms tăng tầm chém, lướt nhanh, hút vàng), hòm kho báu",
                        "prompt": "2D pixel art metroidvania interactive items: ornate carved stone bench checkpoint with glowing hanging lantern, glowing glass soul flask with liquid essence, 8 ancient rune charms and badges, shiny silver keys, treasure chest, transparent background",
                        "completed": False
                    }
                ]
            },
            {
                "id": "rk_ui_silksong_hud_and_map",
                "name": "26. Bộ Giao Diện Máu Mào Gà & Bản Đồ Mê Cung (Silksong Silk Spool HUD & Mini-Map UI)",
                "category": "ui",
                "format": "image",
                "format_reason": "Giao diện thanh máu mào gà, cuộn tơ khâu vá hồi máu (Bind Heal), bảng Boss Bar và khung bản đồ mê cung từng phòng -> Dạng Ảnh giao diện",
                "priority": "Cao",
                "status": "pending",
                "animations": ["static_hud", "health_loss_flash", "boss_health_bar", "map_screen"],
                "pipeline_steps": [
                    {
                        "step_name": "🖼️ Bước 1: Bộ UI Kit & Màn Hình Bản Đồ Cổ",
                        "tool_recommended": "ChatGPT / Midjourney",
                        "purpose": "Thanh máu mào gà đỏ phát sáng, cuộn tơ năng lượng hình tròn, 4 ô trang bị phụ kiện, thanh máu Boss uy nghi, khung bản đồ da dê Metroidvania chia ô phòng",
                        "prompt": "2D pixel art metroidvania HUD kit: glowing crimson rooster comb health masks, ornate circular silk spool energy gauge, 4 sub-weapon tool diamond slots, ornate silver boss health bar with skull crest, vintage parchment map room grid screen, transparent background",
                        "completed": False
                    }
                ]
            }
        ]
        
        g['assets'] = all_silksong_assets

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print('EXPANDED_SILKSONG_26_ASSETS_SUCCESSFULLY')
