# Mega Pack: Biểu Cảm Modular & Hiệu Ứng Emote Hoạt Hình Cho Godot 4

Trọn bộ 26 asset biểu cảm mắt, mõm và hiệu ứng cảm xúc trên đầu dành cho các nhân vật và quái vật.

## Cấu trúc thư mục:
- `01_fox_eyes/`: 6 trạng thái mắt và chân mày (Nghi ngờ, Cười híp mắt, Shock co giật, Van xin ứa nước mắt, Bốc hỏa chữ V, Ngủ bình yên).
- `01_fox_snouts/`: 6 trạng thái mõm và miệng (Huýt sáo ngơ ngác, Cười răng khểnh, Thè lưỡi lêu lêu, Há hốc mồm chữ O, La hét gợn sóng, Sưng vù méo mó rụng răng).
- `02_raccoon_wolf_hound_expressions/`: Biểu cảm sói, chó săn và gấu mèo (Sói mắt đỏ rực cuồng nộ, Chó mắt lác ngáo ngơ, Gấu mèo mắt sao vàng tham lam, Sói nhe nanh nhỏ dãi, Gấu mèo đánh răng run lẩy bẩy).
- `03_baron_pig_special/`: Biểu cảm đặc biệt của Baron Pig (Cười đắc thắng lộ răng vàng, Khóc òa phun vòi nước, Kính một tròng văng ra khỏi mắt).
- `04_head_emotes_fx/`: 6 biểu tượng cảm xúc gắn trên đầu quái (Hạt mồ hôi khổng lồ, Gân đỏ tức giận anime 💢, Dấu hỏi ngơ ngác ?, Dấu than báo động !, Dải chữ Zzz ngủ, Ngôi sao pháo hoa chiến thắng).

## Cách dùng trong Godot 4:
1. Gán node `EmoteController` lên đầu quái vật.
2. Gọi hàm `show_emote(preload("res://path/to/emote_icon.svg"))` khi quái phát hiện người chơi, bị trúng đòn, hoặc qua màn.
