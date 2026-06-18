import os
import sys
import time
import queue
import threading
import asyncio
import io
import numpy as np

# Giảm cảnh báo của các thư viện
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import soundcard as sc
from faster_whisper import WhisperModel
from deep_translator import GoogleTranslator
import edge_tts
import pygame

# --- CONFIGURATION ---
SAMPLE_RATE = 16000
CHUNK_DUR = 3.0  # Thời gian mỗi đoạn cắt (giây). Có thể tăng/giảm tuỳ tốc độ nói
CHUNK_FRAMES = int(SAMPLE_RATE * CHUNK_DUR)

audio_queue = queue.Queue()
text_queue = queue.Queue()
audio_play_queue = queue.Queue()

# --- 1. RECORDING THREAD ---
def record_audio():
    print("[*] Đang khởi tạo thu âm hệ thống (Loopback)...")
    try:
        default_speaker = sc.default_speaker()
        mics = sc.all_microphones(include_loopback=True)
        
        loopback_mic = None
        # Cố gắng tìm mic loopback khớp với loa mặc định
        for m in mics:
            if m.name == default_speaker.name:
                loopback_mic = m
                break
        
        if not loopback_mic:
            # Fallback nếu không tìm thấy
            loopback_mic = mics[0] if mics else sc.default_microphone()

        print(f"[*] Đang thu âm từ thiết bị: {loopback_mic.name}")
        
        with loopback_mic.recorder(samplerate=SAMPLE_RATE, channels=1) as recorder:
            while True:
                data = recorder.record(numframes=CHUNK_FRAMES)
                audio_data = data.flatten().astype(np.float32)
                audio_queue.put(audio_data)
                
    except Exception as e:
        print("[!] Lỗi thu âm:", e)

# --- 2. TRANSCRIPTION THREAD ---
def transcribe_audio():
    print("[*] Đang tải model Whisper (lần đầu có thể mất vài chục giây)...")
    # 'tiny' là model nhẹ nhất, chạy nhanh. Có thể đổi sang 'base' hoặc 'small' nếu máy mạnh
    model = WhisperModel("tiny", device="cpu", compute_type="int8")
    print("[*] Tải model Whisper thành công!")
    print("[*] LIVE-DUB SẴN SÀNG! Hãy bật một video tiếng Anh để test thử.\n")
    
    while True:
        audio_data = audio_queue.get()
        
        # Bỏ qua nếu âm lượng quá nhỏ (silence)
        rms = np.sqrt(np.mean(audio_data**2))
        if rms < 0.005:
            continue
            
        try:
            segments, info = model.transcribe(audio_data, beam_size=1, language="en")
            text = " ".join([seg.text for seg in segments]).strip()
            if text:
                print(f"[ENG] {text}")
                text_queue.put(text)
        except Exception as e:
            print("[!] Lỗi STT:", e)

# --- 3. TRANSLATION & TTS THREAD ---
def translate_and_tts():
    translator = GoogleTranslator(source='en', target='vi')
    
    # Thiết lập asyncio loop cho thead này
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    while True:
        text = text_queue.get()
        try:
            vi_text = translator.translate(text)
            print(f"[VIE] {vi_text}")
            
            # Sinh giọng đọc
            loop.run_until_complete(generate_tts(vi_text))
        except Exception as e:
            print("[!] Lỗi Dịch thuật/TTS:", e)

async def generate_tts(text):
    # Sử dụng giọng đọc nữ Hoài My rất tự nhiên của Edge
    communicate = edge_tts.Communicate(text, "vi-VN-HoaiMyNeural")
    audio_data = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data += chunk["data"]
            
    if audio_data:
        audio_play_queue.put(audio_data)

# --- 4. PLAYBACK THREAD ---
def playback_audio():
    pygame.mixer.init()
    while True:
        audio_data = audio_play_queue.get()
        try:
            fp = io.BytesIO(audio_data)
            pygame.mixer.music.load(fp)
            pygame.mixer.music.play()
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
        except Exception as e:
            print("[!] Lỗi Phát âm thanh:", e)

# --- MAIN ---
if __name__ == "__main__":
    t1 = threading.Thread(target=record_audio, daemon=True)
    t2 = threading.Thread(target=transcribe_audio, daemon=True)
    t3 = threading.Thread(target=translate_and_tts, daemon=True)
    t4 = threading.Thread(target=playback_audio, daemon=True)
    
    t1.start()
    t2.start()
    t3.start()
    t4.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[*] Đã dừng ứng dụng.")
        sys.exit(0)
