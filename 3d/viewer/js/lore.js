export const LoreData = [
    {
        id: "mem_01",
        title: "Nhật ký ngày 1",
        content: "Cơ thể anh ấy đang suy yếu... Tôi không thể để anh ấy chết. Tôi sẽ không chấp nhận điều đó. KHÔNG BAO GIỜ."
    },
    {
        id: "mem_02",
        title: "Nhật ký ngày 47",
        content: "Ba mẹ anh ấy gọi điện nói tôi bị tâm thần. Họ muốn mang anh ấy đi khỏi tôi. Tôi sẽ KHÔNG cho phép điều đó xảy ra."
    },
    {
        id: "mem_03",
        title: "Bản ghi âm",
        content: "[Tiếng khóc nấc] Lily... con gái bé bỏng của mẹ... Tại sao bọn họ lại cướp con khỏi mẹ? Tại sao? Tai nạn đó... không phải tai nạn. Họ CỐ TÌNH giết con."
    },
    {
        id: "mem_04",
        title: "Email nội bộ - [ĐÃ XÓA]",
        content: "'Hội đồng đạo đức đã từ chối Dự Án Symbiosis. Tiến sĩ Eleanor bị cấm tiếp cận phòng thí nghiệm. Mẫu vật Subject Zero phải bị tiêu hủy ngay lập tức.' - Đính kèm: Lệnh tiêu hủy ký bởi... [DỮ LIỆU BỊ XÓA BỞI ADMIN_ELEANOR]"
    },
    {
        id: "mem_05",
        title: "Bản tin khẩn [Ngày XX/XX]",
        content: "Đội cứu hộ Delta mất liên lạc sau khi tiến vào tầng B7 của cơ sở Aegis. Nghi ngờ bị Tiến sĩ Eleanor thao túng hệ thống phòng thủ. Cử thêm đội Alpha xuống... [Kết thúc bản tin]"
    },
    {
        id: "mem_06",
        title: "[Bản ghi âm cá nhân - Eleanor]",
        content: "Ngày thảm họa đó... dịch bệnh rò rỉ từ phòng thí nghiệm của tôi. Tôi đã giết tất cả. Ba mẹ anh, ba mẹ tôi, anh chị em... và Lily. Con gái bé bỏng của chúng tôi chết trong vòng tay tôi. Tất cả là lỗi của tôi. TẤT CẢ. Tôi không thể tha thứ cho bản thân... nhưng tôi cũng không thể để mất thêm anh ấy. Anh ấy là người cuối cùng của tôi."
    },
    {
        id: "mem_07",
        title: "Nhật ký kĩ thuật",
        content: "Chip thần kinh NX-7 có khả năng bóp méo thị giác vật chủ. Hình ảnh thật sẽ bị thay thế bằng hình ảnh do Operator nạp vào. Cảnh báo: Sử dụng kéo dài sẽ gây tổn thương não vĩnh viễn cho vật chủ."
    },
    {
        id: "mem_08",
        title: "[Tin nhắn thoại - Zero]",
        content: "'Eleanor... anh biết em đang đau lòng. Anh cũng vậy. Nhưng Lily đã ra đi rồi. Ba mẹ cũng vậy. Anh sắp chết vì bệnh... Hãy để anh đi thanh thản. Đừng làm gì dại dột... Em hứa với anh đi.' [Kết thúc tin nhắn]"
    }
];

export const LoreSystem = {
    unlockedMemories: new Set(),
    isMenuOpen: false,

    unlock(id) {
        if (!this.unlockedMemories.has(id)) {
            this.unlockedMemories.add(id);
            this.showNotification();
            
            // Trigger Dialogues based on specific fragments picked up
            if (window.DialogueSystem) {
                if (id === 'mem_03') {
                    window.DialogueSystem.show("ĐỪNG! Đừng đọc cái đó! Đó là... dữ liệu bị hỏng. Xóa nó đi anh. Xin anh.", "glitch", 5000);
                } else if (id === 'mem_05') {
                    window.DialogueSystem.show("Anh... bản tin đó là giả. Bọn họ tạo ra nó để gây hoang mang. Em không bao giờ làm hại ai cả. Em chỉ muốn bảo vệ anh thôi mà...", "worried", 5000);
                } else if (id === 'mem_07') {
                    window.DialogueSystem.show("...Em làm vậy vì em yêu anh.", "normal", 4000);
                } else if (id === 'mem_08') {
                    window.DialogueSystem.show("ANH ĐÃ HỨA SẼ Ở BÊN EM! ANH NÓI ANH YÊU EM! TẠI SAO... tại sao anh muốn bỏ em lại một mình?!", "angry", 5000);
                }
            }
            
            if (this.unlockedMemories.size >= 8) {
                window.trueEndUnlocked = true;
            }

            return true;
        }
        return false;
    },

    isUnlocked(id) {
        return this.unlockedMemories.has(id);
    },

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        const menu = document.getElementById('lore-menu');
        if (menu) {
            if (this.isMenuOpen) {
                menu.classList.remove('hidden');
                this.renderMemories();
                // Play open sound
                if (window.GlitchSystem) window.GlitchSystem.trigger(0.2, 2);
            } else {
                menu.classList.add('hidden');
            }
        }
    },

    showNotification() {
        const notif = document.getElementById('lore-notification');
        if (notif) {
            notif.classList.remove('translate-x-full', 'opacity-0');
            setTimeout(() => {
                notif.classList.add('translate-x-full', 'opacity-0');
            }, 3000);
        }
    },

    renderMemories() {
        const list = document.getElementById('lore-list');
        const detailTitle = document.getElementById('lore-detail-title');
        const detailContent = document.getElementById('lore-detail-content');
        if (!list) return;

        list.innerHTML = '';
        detailTitle.innerText = 'CHỌN MỘT MẢNH KÝ ỨC';
        detailContent.innerText = '';

        LoreData.forEach((lore, index) => {
            const btn = document.createElement('button');
            const unlocked = this.isUnlocked(lore.id);
            
            btn.className = `w-full text-left p-3 mb-2 border ${unlocked ? 'border-primary text-primary hover:bg-primary/20' : 'border-gray-700 text-gray-700'} font-headline tracking-widest transition-colors`;
            
            if (unlocked) {
                btn.innerHTML = `[${index + 1}] ${lore.title}`;
                btn.onclick = () => {
                    detailTitle.innerText = lore.title;
                    detailContent.innerText = lore.content;
                    if (window.GlitchSystem) window.GlitchSystem.trigger(0.1, 1);
                };
            } else {
                btn.innerHTML = `[${index + 1}] < DATA CORRUPTED >`;
                btn.onclick = () => {
                    detailTitle.innerText = 'LỖI TRUY CẬP';
                    detailContent.innerText = 'Dữ liệu bị mã hóa hoặc chưa được tìm thấy.';
                };
            }
            
            list.appendChild(btn);
        });
    }
};

window.LoreData = LoreData;
window.LoreSystem = LoreSystem;
