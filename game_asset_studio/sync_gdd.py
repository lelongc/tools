import json

# Comprehensive 60-Level Expansion for Cluck & Drop: Bunker Buster
project_data = {
    "active_game_id": "game_cluck_and_drop",
    "games": [
        {
            "id": "game_cluck_and_drop",
            "title": "Cluck & Drop: Bunker Buster (Chiến Dịch Bão Lòng Đất - 60 Màn Chơi)",
            "genre": "2D Physics Destruction Puzzle / Vertical Gravity Bunker Buster",
            "art_style": "Glossy 2D Cartoon Vector, Rich Juicy Physics, Vibrant Colors, Angry Birds & Cut The Rope Aesthetic",
            "raw_input_story": "Kế hoạch 60 Màn Chơi Chia 4 Thế Giới: Gà Mẹ Clucky nã trứng dị biến phá hủy 60 căn hầm ngục từ dễ đến siêu khó, đè bẹp lũ Cáo trộm trứng và giải cứu bầy gà con.",
            "full_story": {
                "synopsis": "Hành trình 60 màn chơi vượt 4 Thế Giới ngầm kiên cố: Thế Giới 1 (Nông Trại Hang Đất), Thế Giới 2 (Mỏ Đá Bê Tông), Thế Giới 3 (Nhà Máy Hơi Nước Độc Dược), Thế Giới 4 (Lòng Núi Lửa Hoàng Gia). Quái vật và công trình tăng dần độ kiên cố, xuất hiện quái giáp nón sắt, quái to trùm hầm cần đòn nghiền nát nặng hàng tấn.",
                "protagonist": "Gà Mẹ Clucky (Thân tròn béo ú, đội mũ phi công steampunk, lái trực thăng chong chóng tre mini, mắt liếc ngắm bắn thông minh).",
                "antagonists": "Cáo Con Trộm Trứng, Cáo Lính Canh, Gấu Mèo Thợ Mỏ Đội Mũ Sắt, Chó Săn Bọc Giáp Gai, Cáo Kỹ Sư Độc Dược, Cận Vệ Heo Rừng Hoàng Gia, và Đại Boss Heo Trùm Hoàng Gia Baron Pig.",
                "environment": "4 Vùng Địa Hình: 1. Nông Trại Hang Đất (Màn 1-15), 2. Mỏ Đá Bê Tông (Màn 16-30), 3. Nhà Máy Độc Dược Steampunk (Màn 31-45), 4. Hầm Dung Nham Hoàng Gia (Màn 46-60).",
                "gameplay_elements": "Vật lý phá hủy kết cấu đa tầng (Destruction Physics), Kích hoạt kỹ năng giữa không trung (Tap-in-Flight), Phản ứng dây chuyền Domino TNT, Bẫy đá lăn & Hầm gió ngược, Giải cứu lồng gà con, Hệ thống Rewarded Ad Siêu Bom Nuke, Độ khó 60 màn tăng dần."
            },
            "level_campaign_plan": {
                "total_levels": 60,
                "worlds": [
                    {
                        "world_id": 1,
                        "name": "Thế Giới 1: Nông Trại Hang Đất (Farm Cavern)",
                        "levels": "Màn 1 -> Màn 15",
                        "theme": "Đất xốp, cỏ xanh, rễ cây ngầm, hang đất ấm cúng",
                        "materials": "Gỗ thông nhẹ (HP 80), Kính giòn (HP 25), Thùng TNT đơn (Radius 220)",
                        "enemies": "Cáo Con Trộm Trứng (40 HP), Cáo Lính Canh (60 HP), Boss Cáo Đại Ca Màn 15 (200 HP)",
                        "unlocked_eggs": "Trứng Thường Nặng Ký, Trứng Thuốc Nổ Đỏ",
                        "description": "Làm quen với cơ chế ngắm thả rơi và tính năng Tap-in-Flight. Các màn bố trí đơn giản để người chơi thỏa mãn cảm giác sập hầm domino ban đầu."
                    },
                    {
                        "world_id": 2,
                        "name": "Thế Giới 2: Mỏ Đá Bê Tông Kiên Cố (Stone Quarry Bunker)",
                        "levels": "Màn 16 -> Màn 30",
                        "theme": "Hang mỏ đá vôi, vỉa than ngầm, đường ray goòng, mạng nhện",
                        "materials": "Tảng đá Granite (HP 220, Mass 8.5), Cột kính cường lực (HP 40), Thùng TNT kép, Bẫy Tảng Đá Lăn Dốc",
                        "enemies": "Gấu Mèo Thợ Mỏ Đội Mũ Sắt (120 HP - Cản đòn 1), Chó Sói Hầm Mỏ (150 HP), Boss Cỗ Máy Khoan Màn 30 (450 HP)",
                        "unlocked_eggs": "Trứng Mũi Khoan Xuyên Thấu (Drill Penetrator Egg), Trứng Băng Đóng Băng (Frost Egg)",
                        "description": "Độ khó nâng cao, xuất hiện mái đá dày và kẻ địch đội mũ bảo hiểm. Người chơi bắt buộc phải dùng Trứng Khoan tăng tốc siêu thanh đục xuyên trần hoặc dùng Trứng Băng làm giòn kết cấu."
                    },
                    {
                        "world_id": 3,
                        "name": "Thế Giới 3: Nhà Máy Độc Dược Steampunk (Industrial Fortress)",
                        "levels": "Màn 31 -> Màn 45",
                        "theme": "Đường ống dẫn hơi nước đồng thau, bánh răng cưa xoay, bể axit xanh rực",
                        "materials": "Dầm thép kim loại I-Beam (HP 350, chỉ tan khi gặp axit), Bể hóa chất nổ độc, Xích sắt treo tảng đá, Quạt gió hầm đẩy ngược (Updraft Fans)",
                        "enemies": "Chó Săn Bọc Giáp Gai (220 HP, Mass 4.0), Cáo Kỹ Sư Độc Dược (180 HP), Boss Robot Hóa Chất Màn 45 (700 HP)",
                        "unlocked_eggs": "Trứng Axit Nham Thạch (Acid Lava Egg), Trứng Gà Con Náo Loạn (Cluster Chicks Egg)",
                        "description": "Kết cấu hầm ngục có quạt gió thổi ngược đổi quỹ đạo trứng và dầm sắt không thể phá bằng đòn thường. Phải dùng Trứng Axit ăn mòn chân đế hoặc thả Trứng Gà Con kích hoạt công tắc mở van."
                    },
                    {
                        "world_id": 4,
                        "name": "Thế Giới 4: Hầm Dung Nham Hoàng Gia (Lava Core Imperial Fortress)",
                        "levels": "Màn 46 -> Màn 60",
                        "theme": "Lòng núi lửa magma sôi sục, cột đá hắc diện thạch Obsidian, ngai vàng của Boss",
                        "materials": "Đá Hắc Diện Thạch Obsidian (HP 500, Mass 15.0), Thùng Thuốc Nổ Hạt Nhân Nuke, Cổng dịch chuyển Wormhole, Lồng Giam Gà Con Hoàng Gia",
                        "enemies": "Cận Vệ Heo Rừng Hoàng Gia (350 HP, Mass 6.0), Quái Thú Dung Nham (500 HP), ĐẠI BOSS HEO TRÙM BÁ TƯỚC BARON PIG Màn 60 (1500 HP - 3 Giai Đoạn Sập Hầm)",
                        "unlocked_eggs": "Trứng Phản Trọng Lực Lỗ Đen (Black Hole Egg), Siêu Trứng Rồng Hoàng Kim (Golden Dragon Egg)",
                        "description": "Đỉnh cao chiến thuật giải đố vật lý: Căn hầm khổng lồ 4 tầng với nhiều cạm bẫy, đòi hỏi chuỗi combo thả trứng tính toán hoàn hảo từng giây để tạo phản ứng sập toàn diện."
                    }
                ]
            },
            "assets": [
                # =========================================================
                # 1. NHÂN VẬT CHÍNH (PLAYER & VEHICLES)
                # =========================================================
                {
                    "id": "asset_clucky_pilot",
                    "name": "Gà Mẹ Phi Công Clucky (Clucky The Mother Hen)",
                    "category": "characters",
                    "format": "image",
                    "format_reason": "Nhân vật chính 2D Vector hoạt hình bóng bẩy",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Full body centered front view of a cute round chubby mother hen wearing a brown leather aviator pilot helmet and goggles on head, bright glossy yellow feathers, red comb on top, orange beak, big sparkling cartoon eyes with funny determined expression, holding a wooden control stick, 2D vector cartoon game character, clean bold black outline, bright vibrant flat colors with soft highlights, Angry Birds and Cut the Rope art style, game asset, white clean background --no background",
                    "animations": ["idle_patrol", "aim_look_down", "squash_lay_egg", "victory_cheer", "panic"]
                },
                {
                    "id": "asset_flying_chopper",
                    "name": "Trực Thăng Chong Chóng Tre Mini (Clucky's Bamboo Chopper)",
                    "category": "characters",
                    "format": "image",
                    "format_reason": "Phương tiện bay của Gà Mẹ",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Cute cartoon mini wooden helicopter with spinning bamboo propeller on top, woven wicker basket at the bottom, steampunk brass gears and gauges, 2D vector game sprite, clean outline, bright cartoon colors, white background --no background",
                    "animations": ["propeller_spin", "engine_puff"]
                },
                {
                    "id": "asset_rescued_baby_chick",
                    "name": "Bé Gà Con Cứu Hộ (Rescued Yellow Baby Chick)",
                    "category": "characters",
                    "format": "image",
                    "format_reason": "Bé gà con đáng yêu được giải cứu khỏi lồng",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Super cute tiny round fluffy yellow baby chick, big sparkling black cartoon eyes, tiny open orange beak, happy cheerful hopping pose, blushing pink cheeks, 2D vector cartoon sprite, bold outlines, white background --no background",
                    "animations": ["hop_run", "cheer_confetti", "peck_switch"]
                },

                # =========================================================
                # 2. BỘ SƯU TẬP 7 LOẠI TRỨNG DỊ BIẾN (MUTANT PROJECTILES)
                # =========================================================
                {
                    "id": "asset_egg_heavy_normal",
                    "name": "Trứng Thường Nặng Ký (Heavy Normal Egg)",
                    "category": "projectiles",
                    "format": "image",
                    "format_reason": "Trứng cơ bản - Tap-in-Flight hóa Kim Cương Siêu Nặng",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Cute shiny cartoon chicken egg wearing a small iron soldier helmet with a star, cream eggshell with tiny light brown speckles, glossy clean vector art style, bold outlines, white background --no background",
                    "animations": ["drop_fall", "squash_impact", "diamond_boost_mode", "shell_crack_pieces"]
                },
                {
                    "id": "asset_egg_tnt_bomb",
                    "name": "Trứng Thuốc Nổ Đỏ (TNT Bomb Egg)",
                    "category": "projectiles",
                    "format": "image",
                    "format_reason": "Trứng phát nổ xung kích - Tap-in-Flight nổ sớm Air Burst",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Dangerous and funny cartoon bomb egg, bright red shell with black skull icon and danger yellow stripes, burning sizzling rope fuse on top with yellow sparks, glowing angry eyes, 2D vector game sprite, white background --no background",
                    "animations": ["fuse_burn", "detonate_burst", "shockwave_ring"]
                },
                {
                    "id": "asset_egg_drill_steel",
                    "name": "Trứng Mũi Khoan Xuyên Thấu (Drill Penetrator Egg)",
                    "category": "projectiles",
                    "format": "image",
                    "format_reason": "Trứng bọc thép - Tap-in-Flight kích hoạt Tên Lửa Siêu Thanh",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Heavy industrial drill egg made of polished steel armor, golden spiral sharp drill cone at the bottom, spinning turbine vents with orange exhaust glow, 2D cartoon game asset, clean vector style, white background --no background",
                    "animations": ["drill_spin", "rocket_boost_fire", "sparks_burst"]
                },
                {
                    "id": "asset_egg_frost_shatter",
                    "name": "Trứng Băng Pha Lê (Frost Shatter Ice Egg)",
                    "category": "projectiles",
                    "format": "image",
                    "format_reason": "Trứng đóng băng mọi kết cấu thành thủy tinh giòn",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Magical crystal frozen egg made of shiny translucent cyan ice, sharp snowflake spikes, glowing cold blue mist aura, 2D vector cartoon sprite, white background --no background",
                    "animations": ["frost_trail", "freeze_burst", "ice_crystals"]
                },
                {
                    "id": "asset_egg_cluster_chicks",
                    "name": "Trứng Gà Con Náo Loạn (Cluster Chicks Egg)",
                    "category": "projectiles",
                    "format": "image",
                    "format_reason": "Trứng nứt vỏ nở ra 5 chú gà con chạy nhốn nháo kích hoạt bẫy",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Cracked pastel pink egg with 3 tiny baby chicks peeking out with cute big eyes and open beaks, adorable 2D cartoon game sprite, clean bold outlines, white background --no background",
                    "animations": ["crack_open", "chicks_scatter", "peck_run"]
                },
                {
                    "id": "asset_egg_acid_lava",
                    "name": "Trứng Axit Nham Thạch (Acid Lava Egg)",
                    "category": "projectiles",
                    "format": "image",
                    "format_reason": "Lòng đỏ sôi sùng sục làm tan chảy dầm thép kim loại",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Glowing neon toxic green and magma orange bubbling slime egg with bubbling molten yolk visible through translucent shell, sizzling chemical steam, 2D cartoon vector game asset, white background --no background",
                    "animations": ["bubble_idle", "melt_splash", "acid_puddle"]
                },
                {
                    "id": "asset_egg_blackhole_vortex",
                    "name": "Trứng Lỗ Đen Phản Trọng Lực (Black Hole Vortex Egg)",
                    "category": "projectiles",
                    "format": "image",
                    "format_reason": "Trứng vũ trụ hút mọi khối đá và quái vật vào tâm rồi nổ tung",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Mystical cosmic purple and deep navy egg with a miniature swirling galactic black hole vortex center, golden orbital ring, sparkling stardust particles, 2D vector game asset, white background --no background",
                    "animations": ["gravity_vortex_pulse", "vacuum_collapse", "supernova_blast"]
                },

                # =========================================================
                # 3. KẺ ĐỊCH & BOSS 4 THẾ GIỚI (ENEMIES & BOSSES)
                # =========================================================
                {
                    "id": "asset_enemy_sly_fox",
                    "name": "Cáo Con Trộm Trứng (Sly Fox Bandit - World 1)",
                    "category": "enemies",
                    "format": "image",
                    "format_reason": "Kẻ địch cơ bản World 1 (40 HP - Máu giấy)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Funny cartoon orange fox wearing a black bandit eye mask and a striped thief shirt, sneaky smiling expression, big bushy tail, 2D vector game sprite, bold outlines, white background --no background",
                    "animations": ["idle_taunt", "panic_look_up", "squashed_flat", "dizzy_stars"]
                },
                {
                    "id": "asset_enemy_fox_guard",
                    "name": "Cáo Lính Canh Hầm (Fox Guard - World 1)",
                    "category": "enemies",
                    "format": "image",
                    "format_reason": "Lính canh tiêu chuẩn World 1 (60 HP)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Grumpy cartoon fox wearing a blue guard uniform and a small wooden helmet, holding a wooden spear, funny scowling face, 2D vector game sprite, white background --no background",
                    "animations": ["idle_stand", "panic_scream", "squashed_flat"]
                },
                {
                    "id": "asset_enemy_armored_raccoon",
                    "name": "Gấu Mèo Thợ Mỏ Mũ Sắt (Armored Miner Raccoon - World 2)",
                    "category": "enemies",
                    "format": "image",
                    "format_reason": "Kẻ địch có nón bảo hiểm cản 1 đòn (120 HP)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Cute chubby raccoon wearing a heavy silver mining hard hat with a front flashlight, holding a wrench, scared nervous eyes, 2D vector game character, white background --no background",
                    "animations": ["idle_patrol", "helmet_pop_off", "squashed_flat"]
                },
                {
                    "id": "asset_enemy_mine_wolf",
                    "name": "Chó Sói Hầm Mỏ (Mine Wolf - World 2)",
                    "category": "enemies",
                    "format": "image",
                    "format_reason": "Kẻ địch hung dữ World 2 (150 HP)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Tough gray cartoon wolf wearing leather harness and spiked shoulder pads, snarling funny sharp teeth, crossed arms, 2D vector sprite, white background --no background",
                    "animations": ["idle_snarl", "panic_howl", "squashed_flat"]
                },
                {
                    "id": "asset_enemy_spike_hound",
                    "name": "Chó Săn Bọc Giáp Gai (Spike Armored Hound - World 3)",
                    "category": "enemies",
                    "format": "image",
                    "format_reason": "Kẻ địch giáp nặng World 3 (220 HP, Mass 4.0)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Bulky armored guard bulldog with full brass steampunk plate armor, spiked collar, steam venting from back armor, angry red glowing goggles, 2D vector game sprite, white background --no background",
                    "animations": ["idle_breathe", "armor_crack", "squashed_heavy"]
                },
                {
                    "id": "asset_enemy_toxic_fox_engineer",
                    "name": "Cáo Kỹ Sư Độc Dược (Toxic Fox Engineer - World 3)",
                    "category": "enemies",
                    "format": "image",
                    "format_reason": "Kẻ địch World 3 (180 HP, có bình hóa chất)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Mad scientist cartoon fox wearing a hazmat apron, thick rubber goggles, and holding a green potion flask, crazy green mustache, 2D vector sprite, white background --no background",
                    "animations": ["idle_potion_shake", "panic_chemical_splash", "squashed_flat"]
                },
                {
                    "id": "asset_enemy_imperial_boar",
                    "name": "Cận Vệ Heo Rừng Hoàng Gia (Imperial Boar Guard - World 4)",
                    "category": "enemies",
                    "format": "image",
                    "format_reason": "Cận vệ siêu trâu World 4 (350 HP, Mass 6.0)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Gigantic muscular wild boar warrior in gold-trimmed obsidian royal armor, massive curved ivory tusks, royal crimson cape, fierce angry red eyes, 2D vector cartoon sprite, white background --no background",
                    "animations": ["idle_stomp", "tusk_shatter", "squashed_massive"]
                },
                {
                    "id": "asset_enemy_boss_baron_pig",
                    "name": "ĐẠI BOSS HEO TRÙM BÁ TƯỚC (Baron Pig Final Emperor Boss - Màn 60)",
                    "category": "enemies",
                    "format": "image",
                    "format_reason": "Đại Boss cuối game (1500 HP - 3 Giai đoạn sụp hầm liên hoàn)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Gigantic ultra fat cartoon Emperor Pig sitting on an opulent golden throne, wearing an oversized jewel-encrusted imperial crown, luxurious velvet robe, holding a golden fork and egg sceptre, arrogant smug grin with double chins, 2D vector boss sprite, bold clean outline, white background --no background",
                    "animations": ["boss_idle_laugh", "stage1_damage_furious", "stage2_panic_screaming", "crown_fly_off", "grand_boss_explosion"]
                },

                # =========================================================
                # 4. VẬT LIỆU XÂY HẦM & CẠM BẪY (BLOCKS & GIMMICKS)
                # =========================================================
                {
                    "id": "asset_block_wood_plank",
                    "name": "Thanh Xà Gỗ Chịu Lực (Wood Plank Beam)",
                    "category": "destructibles",
                    "format": "image",
                    "format_reason": "Vật liệu gỗ thông World 1 (HP 80)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Modular wooden plank beam for physics puzzle game, polished pine wood texture with wood grain, golden metal bolt brackets on ends, clean 2D vector cartoon sprite, isolated on white background --no background",
                    "animations": ["intact", "cracked", "wood_splinters"]
                },
                {
                    "id": "asset_block_stone_slab",
                    "name": "Tảng Đá Bê Tông Granite (Heavy Stone Slab)",
                    "category": "destructibles",
                    "format": "image",
                    "format_reason": "Vật liệu đá nặng World 2 (HP 220, Mass 8.5)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Modular heavy gray stone block slab for 2D physics game, chiseled rock edge, moss accents, sturdy concrete texture, cartoon vector game asset, white background --no background",
                    "animations": ["intact", "cracked", "stone_dust_debris"]
                },
                {
                    "id": "asset_block_glass_pillar",
                    "name": "Cột Kính Pha Lê Giòn Tan (Glass Crystal Pillar)",
                    "category": "destructibles",
                    "format": "image",
                    "format_reason": "Vật liệu kính trong suốt dễ vỡ (HP 25)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Modular semi-transparent cyan glass crystal column pillar, glowing light reflections, delicate geometric edges, 2D cartoon game asset, white background --no background",
                    "animations": ["intact", "shattered_glass_shards"]
                },
                {
                    "id": "asset_block_steel_ibeam",
                    "name": "Dầm Thép Chữ I Steampunk (Industrial Steel I-Beam)",
                    "category": "destructibles",
                    "format": "image",
                    "format_reason": "Vật liệu sắt thép World 3 (HP 350 - Cần Axit)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Heavy industrial steel I-beam girder with riveted brass plates, rust patina, metallic highlights, 2D cartoon game asset, white background --no background",
                    "animations": ["intact", "acid_corrosion", "metal_tear"]
                },
                {
                    "id": "asset_block_obsidian_slab",
                    "name": "Khối Đá Hắc Diện Thạch (Obsidian Lava Slab)",
                    "category": "destructibles",
                    "format": "image",
                    "format_reason": "Vật liệu đá núi lửa World 4 siêu cứng (HP 500, Mass 15.0)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Ultra dense black obsidian stone block with glowing red lava veins running through cracks, glossy volcanic glass texture, 2D cartoon vector game asset, white background --no background",
                    "animations": ["intact", "magma_crack", "volcanic_shatter"]
                },
                {
                    "id": "asset_block_tnt_barrel",
                    "name": "Thùng Thuốc Nổ TNT Đỏ (Red TNT Explosive Barrel)",
                    "category": "destructibles",
                    "format": "image",
                    "format_reason": "Thùng nổ cơ bản (Radius 220, Damage 600)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Classic red wooden gunpowder barrel with bold white TNT stencil label, dark iron bands, short burning fuse rope on top with spark, 2D vector cartoon sprite, white background --no background",
                    "animations": ["idle", "fuse_sparking", "explosion_blast"]
                },
                {
                    "id": "asset_block_nuke_barrel",
                    "name": "Thùng Bom Hạt Nhân Vàng (Mega Nuke Hazard Barrel)",
                    "category": "destructibles",
                    "format": "image",
                    "format_reason": "Thùng bom siêu nổ World 4 (Radius 450, Damage 1500)",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Heavy bright yellow radioactive hazard barrel with black radiation trefoil symbol, reinforced titanium casing, pulsing green LED warning lights, 2D cartoon game sprite, white background --no background",
                    "animations": ["idle_pulse", "critical_meltdown", "atomic_mushroom_blast"]
                },
                {
                    "id": "asset_gimmick_rolling_boulder",
                    "name": "Bẫy Tảng Đá Lăn Khổng Lồ (Giant Rolling Boulder)",
                    "category": "destructibles",
                    "format": "image",
                    "format_reason": "Vật thể lăn theo dốc nghiền nát hầm ngục",
                    "priority": "Trung bình",
                    "status": "pending",
                    "prompt_image": "Massive spherical heavy ancient stone boulder with cracks and carved tribal spiral patterns, 2D cartoon game asset, white background --no background",
                    "animations": ["roll_spin", "crush_impact"]
                },
                {
                    "id": "asset_gimmick_chick_cage",
                    "name": "Lồng Giam Gà Con Cứu Hộ (Rescue Chick Cage)",
                    "category": "destructibles",
                    "format": "image",
                    "format_reason": "Lồng sắt giam gà con để người chơi giải cứu lấy Bonus Star",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Hanging wooden and iron cage containing a scared crying little yellow chick, padlock on the door, 2D cartoon game asset, white background --no background",
                    "animations": ["locked", "cage_broken_open", "chick_happy_freedom"]
                },
                {
                    "id": "asset_gimmick_updraft_fan",
                    "name": "Quạt Gió Hầm Ngầm Đẩy Ngược (Updraft Wind Vent)",
                    "category": "destructibles",
                    "format": "image",
                    "format_reason": "Cơ chế quạt gió thổi luồng khí đẩy trứng bay lượn",
                    "priority": "Trung bình",
                    "status": "pending",
                    "prompt_image": "Subterranean brass steampunk ventilation grate with spinning steel fan blades, blowing visible upward swirling cyan wind gusts and dust swirls, 2D cartoon game sprite, white background --no background",
                    "animations": ["fan_spin_gust"]
                },

                # =========================================================
                # 5. BỐI CẢNH 4 THẾ GIỚI (4 WORLD BACKGROUNDS)
                # =========================================================
                {
                    "id": "asset_bg_world1_farm",
                    "name": "Bối Cảnh World 1: Nông Trại Hang Đất (Farm Cavern 9:16)",
                    "category": "environments",
                    "format": "image",
                    "format_reason": "Background cắt ngang lòng đất 540x960 World 1",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "2D mobile vertical 9:16 background for puzzle game, top third shows bright cheerful blue sky with fluffy cartoon clouds and green grass ground surface, bottom two thirds shows rich subterranean underground cross-section dirt layers with tree roots and dark cozy cavern interior, clean cartoon art style, vivid colors",
                    "animations": ["clouds_parallax"]
                },
                {
                    "id": "asset_bg_world2_quarry",
                    "name": "Bối Cảnh World 2: Mỏ Đá Bê Tông (Stone Quarry Mine 9:16)",
                    "category": "environments",
                    "format": "image",
                    "format_reason": "Background mỏ than và hang đá vôi World 2",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "2D mobile vertical 9:16 underground stone mine background, amber sunset sky on top, rugged gray granite and limestone rock layers underground with mine cart tracks and timber supports, stylized cartoon game art",
                    "animations": ["lamp_flicker"]
                },
                {
                    "id": "asset_bg_world3_steampunk",
                    "name": "Bối Cảnh World 3: Nhà Máy Hơi Nước Độc Dược (Industrial Fortress 9:16)",
                    "category": "environments",
                    "format": "image",
                    "format_reason": "Background hầm ngục công nghiệp hơi nước World 3",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "2D vertical 9:16 underground steampunk factory background, smoggy copper sky on top with factory chimneys, brass pipes emitting steam, glowing amber lamps, iron girders and bubbling green acid vats underground, vibrant stylized cartoon art style",
                    "animations": ["pipe_steam"]
                },
                {
                    "id": "asset_bg_world4_lava_core",
                    "name": "Bối Cảnh World 4: Hầm Dung Nham Hoàng Gia (Lava Core Depth 9:16)",
                    "category": "environments",
                    "format": "image",
                    "format_reason": "Background lòng núi lửa magma World 4",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "2D mobile vertical 9:16 volcanic fortress background, dark crimson stormy ash sky on top with volcanic lightning, subterranean cross-section with glowing fiery magma rivers, black obsidian basalt columns, golden imperial banners, epic cartoon game atmosphere",
                    "animations": ["magma_glow_pulse"]
                },

                # =========================================================
                # 6. HIỆU ỨNG HÌNH ẢNH (VFX & PARTICLES)
                # =========================================================
                {
                    "id": "asset_vfx_explosion_pack",
                    "name": "Bộ Hiệu Ứng Nổ Lửa & Sóng Xung Kích (Cartoon Explosion VFX Pack)",
                    "category": "vfx",
                    "format": "image",
                    "format_reason": "Sprite sheet 6 frames nổ lửa giòn tan",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "2D cartoon explosion spritesheet pack, 6 frames animation of a fireball bursting with yellow core, orange flame burst, dark smoke puffs, and floating yellow spark stars, clean vector style, white background --no background",
                    "animations": ["explosion_6frames", "shockwave_ring", "smoke_cloud"]
                },
                {
                    "id": "asset_vfx_dizzy_stars",
                    "name": "Hiệu Ứng Ngôi Sao Xoay Choáng (Dizzy Star Halo VFX)",
                    "category": "vfx",
                    "format": "image",
                    "format_reason": "Hiệu ứng khi quái bị đè bẹp",
                    "priority": "Trung bình",
                    "status": "pending",
                    "prompt_image": "Set of cute shiny yellow cartoon stars and swirling spiral swoosh line for dizzy stunned status effect, clean 2D vector, white background --no background",
                    "animations": ["orbit_spin"]
                },
                {
                    "id": "asset_vfx_debris_particles",
                    "name": "Bộ Mảnh Vỡ Vật Liệu (Debris Shards VFX: Wood, Stone, Glass, Ice)",
                    "category": "vfx",
                    "format": "image",
                    "format_reason": "Mảnh vụn bắn ra khi khối công trình bị vỡ",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Sprite sheet set of shattered debris particles: jagged wood splinters, gray stone pebbles, sparkling cyan glass shards, and ice crystals, clean 2D cartoon game sprites, white background --no background",
                    "animations": ["debris_scatter"]
                },

                # =========================================================
                # 7. GIAO DIỆN & ÂM THANH (UI & AUDIO)
                # =========================================================
                {
                    "id": "asset_ui_star_victory_badge",
                    "name": "Bộ Huy Chương 3 Sao Chiến Thắng (3-Star Victory Badge Set)",
                    "category": "ui",
                    "format": "image",
                    "format_reason": "Icon 3 sao kết thúc màn",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Set of glossy 3D golden stars with cute smiling cartoon faces, sparkling gem reflections, wooden victory frame banner, 2D mobile game UI asset, clean transparent background --no background",
                    "animations": ["star_pop_in", "banner_bounce"]
                },
                {
                    "id": "asset_ui_egg_shelf_icons",
                    "name": "Bộ Icon Khay Đạn Trứng (Egg Ammo Inventory UI)",
                    "category": "ui",
                    "format": "image",
                    "format_reason": "Icon các loại trứng trên thanh HUD",
                    "priority": "Cao",
                    "status": "pending",
                    "prompt_image": "Set of 7 circular wooden and brass UI buttons containing colorful egg icons (Normal Egg, Bomb Egg, Drill Egg, Frost Egg, Chick Egg, Acid Egg, Black Hole Egg), glossy cartoon mobile UI style, white background --no background",
                    "animations": ["selected_glow", "empty_dark"]
                }
            ]
        }
    ]
}

db_path = r"d:\folder\tools\game_asset_studio\game_projects.json"
with open(db_path, "w", encoding="utf-8") as f:
    json.dump(project_data, f, ensure_ascii=False, indent=2)

print("GAME_PROJECTS_JSON_60_LEVELS_AND_FULL_ASSETS_SYNCED_SUCCESSFULLY")
