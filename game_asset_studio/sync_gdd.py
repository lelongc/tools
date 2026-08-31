import json

db_path = r'd:\folder\tools\game_asset_studio\game_projects.json'
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

for g in db['games']:
    if g['id'] == 'game_crossy_rooster':
        g['title'] = 'The Bleeding Comb: Obscure Resurrection (Mào Máu Đoạn Hồn)'
        g['genre'] = '2D Dark Fantasy Action Metroidvania & Psychological Roguelite'
        g['art_style'] = '16-Bit Crimson Gothic Pixel Art, Rich 4-Layer Parallax, Near-Death Mind Freeze'
        g['raw_input_story'] = 'Chiến kê già Gallus dấn thân vào luyện ngục ký ức để tìm lại người vợ Sari và 3 quả trứng. Mỗi lần chết là một lần mất ký ức và đốt cháy linh hồn vợ. Để lấy lại ký ức, phải quay lại đánh với ảo ảnh biến dạng của quá khứ. Cú bẻ lái chấn động: Chính Gallus đã tự tay hủy hoại gia đình trong cơn mộng du và vợ đã dệt nên ảo ảnh để bảo vệ chồng.'
        g['full_story'] = {
            'synopsis': 'Hành trình bi tráng của Gallus qua 5 vùng đất kỳ ảo. Cơ chế Ngọn Lửa Hồn Của Vợ: Mỗi lần chết mất 1 Mảnh Ký Ức (Mất hết = Điên loạn / Game Over). Đánh lại Boss cũ biến dạng để chuộc ký ức. Cơ chế Ngưng Đọng Tâm Trí 0.3s - 0.8s khi máu dưới 25% giúp căn nhịp né đòn sinh tử. Kết thúc đẫm nước mắt khi Gallus chấp nhận sự thật và buông tay để linh hồn đoàn tụ bên gia đình.',
            'protagonist': 'Gallus - Chiến Kê Lão Tướng (Mào chém đứt nửa, cựa sắt gỉ sét, linh hồn mang ngọn lửa tàn của người vợ).',
            'antagonists': 'Đao Phủ Bọ Hung Tội Lỗi, Đại Phán Quan Cú Mèo, Hiệp Sĩ Mào Sắt Khóc Than, Bản Ngã Tội Lỗi & Con Quỷ Ký Sinh.',
            'environment': '1. Hang Nấm Dạ Quang, 2. Lâu Đài Tơ Vàng & Tháp Chuông, 3. Xưởng Rèn Dung Nham, 4. Vườn Hoa Pha Lê Ánh Trăng, 5. Đỉnh Tháp Nguyệt Thực.',
            'gameplay_elements': 'Pogo Đạp Cựa 4 hướng, Lướt Bóng Mờ (Phantom Dash), Ngưng Đọng Tâm Trí Khi Máu <25%, Mất Ký Ức & Chuộc Ký Ức, Giải đố Tiếng Gáy Phù Văn.'
        }

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print('SYNCED_GAME_PROJECTS_JSON_WITH_GDD_SUCCESSFULLY')
