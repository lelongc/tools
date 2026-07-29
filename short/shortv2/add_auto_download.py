with open('c1.py', 'r', encoding='utf-8') as f:
    c1 = f.read()

download_addition = """    print(f"\\n🎉🎉 [HOÀN THÀNH 100%] Đã xuất xong video Short MP4 chuẩn 45-50s: {out_mp4_path.name}", flush=True)
    try:
        from google.colab import files
        print("⬇️ Đang kích hoạt tự động tải video thẳng về máy tính của bạn...", flush=True)
        files.download(str(out_mp4_path))
    except Exception as e:
        print(f"⚠️ Không thể kích hoạt tự động tải về: {e}", flush=True)"""

c1_updated = c1.replace('print(f"\\n🎉🎉 [HOÀN THÀNH 100%] Đã xuất xong video Short MP4 chuẩn 45-50s: {out_mp4_path.name}", flush=True)', download_addition)

with open('c1.py', 'w', encoding='utf-8') as f:
    f.write(c1_updated)

print("Added automatic browser download to c1.py successfully!")
