# Ke hoach phat trien game PSX Horror thanh ban choi duoc 2-3 gio

## 1. Muc tieu san pham
- Bien prototype hien tai thanh mot game kinh di co vong lap choi ro rang, co mo dau, giua va ket thuc.
- Khong chi them do vat, ma moi do vat phai phuc vu mot muc dich gameplay, puzzle, lore hoac scare event.
- Uu tien so 1 la trai nghiem choi tron ven; toi uu hieu nang va editor mode la muc so 2.

## 2. Cach dung ke hoach nay
- Lam tu tren xuong duoi.
- Moi phan co kich ban nho, dau ra ro rang va tieu chi xong.
- Khong mo rong content truoc khi core loop hoat dong.
- Neu mot buoc bi ket, lui ve buoc truoc gan nhat va don gian hoa no.

## 3. Pha 0: Don nen va chuan hoa code
Muc tieu: lam cho code de sua, de them tinh nang va de debug hon.

### 3.0.1 Tach nhom logic
- Tach ro `gameplay`, `interaction`, `ui`, `save`, `audio`, `enemy`, `editor`.
- Khong de mot file lam qua nhieu viec trong cung mot ham.
- Dua cac bien global dang dung chung vao mot object state neu can.

### 3.0.2 Chuan hoa data model
- Chot schema cho object, item, objective, door, note, trigger.
- Moi doi tuong co id ro rang va trang thai rieng.
- Luu version cho save data de sau nay con nang cap duoc.

### 3.0.3 Don UI co ban
- Giu layout play mode va creator mode tach biet.
- Tao san cho HUD: objective, prompt, inventory, hint, dialog.
- Lam cho UI co the bat/tat tung phan thay vi de tram tung len man hinh.

### 3.0.4 Ket qua can dat
- Khong con code rong rac kho doc.
- Co mot noi trung tam chua state game.
- Co mot cau truc de them objective va interaction moi.

## 4. Pha 1: Core loop toi thieu
Muc tieu: nguoi choi vao game la hieu ngay minh phai lam gi.

### 4.1 Objective system
- Tao danh sach objective theo thu tu.
- Hien thi objective hien tai va objective tiep theo.
- Cho phep update objective bang su kien, khong bang hardcode lung tung.
- Them thong bao khi objective moi duoc mo khoa.

### 4.2 Interaction system
- Dung 1 co che chung cho nhin, bam, nhat, mo, doc, kich hoat.
- Hien thi prompt ngan gon khi player nhin vao object hop le.
- Tach interaction theo loai: item, door, note, switch, trigger.

### 4.3 Inventory system
- Phan loai item thanh key item, clue item, consumable, lore item.
- Cho phep nhat, bo, dung, xem mo ta.
- Inventory UI chi can gon va nhanh, khong can qua dep ngay tu dau.

### 4.4 Gate progression
- Mo mot cua dau tien bang key item.
- Mot cong tac hoac keypad de chan duong tiep theo.
- Mot doan backtracking ngan de tao cam giac map dang song.

### 4.5 Ket qua can dat
- Nguoi choi co the bat dau, nhat item, mo khoa, di qua mot gate va thay objective doi.
- Game co mot vong lap ro rang thay vi chi di tham quan.

## 5. Pha 2: Map va level design
Muc tieu: bien map thanh hanh trinh co nhiet do, co nhip va co chien luoc di chuyen.

### 5.1 Chia map thanh khu vuc
- Khu vuc 1: intro room, day objective dau tien.
- Khu vuc 2: corridor, day tension va guidance.
- Khu vuc 3: key room, chua item quan trong.
- Khu vuc 4: safe room, cho player nghi va doc clue.
- Khu vuc 5: threat zone, co scare hoac haunt.
- Khu vuc 6: final room, puzzle cuoi va ending.

### 5.2 Moi room phai co vai tro
- Clue room: chua thong tin.
- Gate room: chan duong.
- Reward room: cho item hoac lore.
- Scare room: tao ap luc.
- Transition room: chuyen doan va giu nhiet.

### 5.3 Backtracking co y nghia
- Cho quay lai nhung phai co su thay doi.
- Co the tat den, dong cua, doi vat the, xuat hien su kien moi.
- Khong de backtracking chi la di lai cho ton thoi gian.

### 5.4 Dan do vat theo muc dich
- Moi do vat lon phai co mot vai tro ro.
- Neu do vat khong phuc vu gameplay, lore, hoac atmosphere thi cat bot.
- Co the dung do vat de che khuat, dua huong nhin, tao diem check interaction.

### 5.5 Ket qua can dat
- Map co cau truc ro, player khong bi lac vo nghia.
- Moi khu vuc co muc dich va co ly do de ton tai.

## 6. Pha 3: Puzzle va progression chi tiet
Muc tieu: tao nut that nho de game khong bi de va khong bi lien tuc.

### 6.1 Puzzle 1 - mo cua dau
- Tim key tu phong dau.
- Doc clue ngan neu key khong nam ro rang.
- Mo cua va kich hoat su kien dau tien.

### 6.2 Puzzle 2 - dien, cong tac, hoac cau chi
- Tim nguon dien hoac cong tac.
- Kich hoat den, mo cua, hoac mo may.
- Dung effect am thanh va flicker de bao hieu da thay doi trang thai map.

### 6.3 Puzzle 3 - code lock hoac symbol lock
- Dat clue o 2-3 noi khac nhau.
- Ghep clue tu note, tranh doan mo.
- Khi dung code, mo khu vuc tiep theo.

### 6.4 Puzzle 4 - manh moi lore
- Dat note, anh, va vat chung theo chu de.
- Ghep thong tin de hieu story.
- Dung lore de khien ending co nghia hon.

### 6.5 Puzzle 5 - final gate
- Co 1 dieu kien cuoi, nhu final key, final code hoac final item.
- Dan toi ending room.
- Ket thuc ro rang, co cam giac giai thoat hoac that bai.

### 6.6 Ket qua can dat
- Puzzle khong qua kho, nhung du de tao nhip.
- Moi puzzle co clue ro va co vi tri hop ly.

## 7. Pha 4: Horror systems
Muc tieu: tao cam giac bi theo doi va co ap luc tam ly.

### 7.1 Audio truoc, visual sau
- Them ambient loop cho tung khu vuc.
- Them footsteps, door creak, pickup, ui click, ghost cue.
- Cho am thanh thay doi theo nguy co va theo khu vuc.

### 7.2 Light va atmosphere
- Dung flicker light tai diem quan trong.
- Dung fog, vignette, dark corner de giam tam nhin.
- Neu co night vision, phai co han che ro.

### 7.3 Threat/ghost system
- Chi can 1 entity don gian cung du neu duoc lam dung.
- Entity xuat hien khi player o lau, sai huong, hoac nhat item quan trong.
- Entity co the chi di quanh khu vuc truoc khi truy sat.

### 7.4 Scripted scares
- Cua dong, guong doi, den tat, sound jump, shadow movement.
- Moi scare phai phuc vu huong dan hoac tang tension.
- Khong lam jump scare lan tray khap map.

### 7.5 Ket qua can dat
- Game khong con cam giac vang lang.
- Nguoi choi cam thay map co gi do dang dien ra.

## 8. Pha 5: UI/UX va dieu khien
Muc tieu: nguoi choi luon hieu minh dang lam gi ma khong bi loang mat.

### 8.1 HUD toi gian
- Objective hien tai.
- Prompt tuong tac.
- Inventory.
- Fear/stamina neu can.

### 8.2 Huong dan ban dau
- Start screen co controls co ban.
- Intro ngan, vao thang vao game neu co the.
- Day nguoi choi bang tinh huong, khong bang text dai.

### 8.3 Hint system
- Neu dung lau o mot khu vuc thi hien gợi y.
- Hint chi goi mo, khong noi thang loi giai.
- Co the tat hint cho nguoi choi thich tu tim.

### 8.4 Ket qua can dat
- UI khong can doan ma van hieu.
- Player khong bi thao tac qua nhieu thu cung luc.

## 9. Pha 6: Noi dung de dat muc tieu 2-3 gio
Muc tieu: ta ra playthrough co du do dai va nhip dieu.

### 9.1 Khung thoi luong
- 15 phut dau: lam quen va tim objective dau.
- 30-45 phut giua: kham pha, puzzle, backtracking.
- 30 phut tiep: su kien kinh di, mo khoa khu vuc moi.
- 30-45 phut cuoi: final puzzle va ending.

### 9.2 So luong content can co
- 6-8 room co y nghia.
- 3-5 item quan trong.
- 5-10 note hoac clue.
- 2-3 puzzle chinh.
- 1 final encounter hoac threat system.

### 9.3 Kich ban dung
- Player thuc day trong phong kin.
- Tim key de thoat ra lang chinh.
- Tien vao khu vuc co dien va note.
- Xuat hien threat lan dau.
- Mo duoc khu vuc tang tren hoac ham.
- Lay final key va thoat.

### 9.4 Ket qua can dat
- Nguoi choi co the choi 2-3 gio ma van thay co muc tieu va co ket thuc.
- Content du nhieu de khong bi lap lai, nhung khong qua nha du de lam.

## 10. Pha 7: Toi uu hieu nang
Muc tieu: giu game on dinh khi content tang len.

### 10.1 Texture pipeline
- Giam base64 trong save neu co the.
- Dung file texture rieng va luu reference.
- Resize va compress truoc khi ship.

### 10.2 Scene optimization
- Frustum culling cho object tinh.
- Tat shadow o object khong can.
- Dung group hoac merge object tinh neu hop ly.

### 10.3 Logic optimization
- Giam DOM query trong vong lap render.
- Tach update theo module.
- Cache object interactable, door, item, note.

### 10.4 Save optimization
- Chia save thanh state runtime va content data.
- Co versioning de tranh hong save.
- Chi save khi can, khong save lien tuc.

### 10.5 Ket qua can dat
- FPS on dinh hon khi map lon dan len.
- File save khong phong qua to.

## 11. Pha 8: Hoan thien va polish
Muc tieu: game co cam giac da xong, khong con prototype.

### 11.1 Polish gameplay
- Chinh toc do di chuyen, camera, collision, jump, stamina.
- Giam bug vung va cham.
- Lam lai interaction cho mem va on dinh.

### 11.2 Polish nghe nhin
- Them ambience theo tung zone.
- Chinh mau, do sang, fog, shadow.
- Them transition khi vao/ra khu vuc quan trong.

### 11.3 Polish noi dung
- Doc lai toan bo clue de dam bao logic.
- Sua cac room bi thua.
- Dam bao ending co cau chuyen va cam giac ket thuc.

### 11.4 Ket qua can dat
- Game co cam giac hoan chinh, khong con lat cat giua cac phan.

## 12. Thu tu lam tung buoc nho
### Buoc 1: Don code va chot schema
- Tach state, object, save, interaction.

### Buoc 2: Lam objective va prompt
- Cho player biet minh can lam gi.

### Buoc 3: Lam inventory va item pickup
- Tao item va luu item.

### Buoc 4: Lam cua khoa va gate progression
- Mo khoa khu vuc tiep theo.

### Buoc 5: Lam note va clue
- Hien thi lore va goi y puzzle.

### Buoc 6: Lam puzzle 1 va 2
- Mo cua, bat dien, di tiep.

### Buoc 7: Them audio va ambience
- Tao khong khi kinh di.

### Buoc 8: Them threat/ghost don gian
- Tao ap luc va script scare.

### Buoc 9: Mo rong map thanh 6-8 room
- Hoan chinh line di chuyen.

### Buoc 10: Lam final puzzle va ending
- Co ket thuc ro rang.

### Buoc 11: Toi uu performance
- Giam texture to, shadow nang, DOM thua.

### Buoc 12: Playtest va sua bug
- Chay thu tu dau toi cuoi.
- Ghi bug, sua bug, chay lai.

## 13. Tieu chi hoan thanh tung pha
- Pha 0 xong khi code de doc va de sua.
- Pha 1 xong khi co core loop co the choi.
- Pha 2 xong khi map co nhip va co vai tro ro.
- Pha 3 xong khi puzzle day duoc game tien len.
- Pha 4 xong khi game co khong khi kinh di that su.
- Pha 5 xong khi UI khong can neu va khong lam roi.
- Pha 6 xong khi co playthrough 2-3 gio.
- Pha 7 xong khi game van on dinh khi content tang.
- Pha 8 xong khi game co cam giac final, khong con prototype.

## 14. Ghi chu cho codebase hien tai
- `psx.js`: nen tach editor code, gameplay code va interaction code thanh cac khoi ro rang.
- `psx.html`: can them HUD cho objective, inventory va prompt.
- `server.py`: phuc vu save/load va texture files theo file binh thuong, tranh save qua to.
- `compress.py`: giu vai tro pre-process asset, khong nen phu thuoc runtime vao Base64 qua nhieu.

## 15. Ket luan ngan
- Khong nen chi them do vat.
- Hay lam theo tung pha nho: core loop -> map -> puzzle -> horror -> UI -> optimization -> polish.
- Khi 7 pha nay hoat dong, game moi su that la di tu prototype sang ban choi duoc hoan chinh.

