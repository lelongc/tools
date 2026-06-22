import asyncio
import websockets
import json
import numpy as np
import threading
import queue
import time
import io
import os
import sys

# Fix Unicode print errors on Windows
sys.stdout.reconfigure(encoding='utf-8')

def log(msg):
    with open("d:\\folder\\tools\\live-dub-local\\server_debug.log", "a", encoding="utf-8") as f:
        f.write(msg + "\n")
    print(msg, flush=True)

import threading
import queue
import time
import io
import os

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from faster_whisper import WhisperModel
from deep_translator import GoogleTranslator
import edge_tts
import pygame

SAMPLE_RATE = 16000
CHUNK_DURATION = 3.0
CHUNK_FRAMES = int(SAMPLE_RATE * CHUNK_DURATION)

pcm_buffer = np.array([], dtype=np.float32)
audio_queue = queue.Queue()
text_queue = queue.Queue()
audio_play_queue = queue.Queue()

# Dùng dictionary để lưu các websocket connections đang active
active_connections = set()
CURRENT_LANG = "en"

# --- STT THREAD ---
def stt_thread():
    log("[*] Đang tải mô hình Whisper...")
    model = WhisperModel("tiny", device="cpu", compute_type="int8")
    log("[*] Tải xong mô hình Whisper.")
    
    while True:
        chunk = audio_queue.get()
        rms = np.sqrt(np.mean(chunk**2))
        if rms < 0.005:
            continue
            
        try:
            segments, _ = model.transcribe(chunk, beam_size=1, language=CURRENT_LANG)
            text = " ".join([seg.text for seg in segments]).strip()
            if text:
                log(f"[{CURRENT_LANG.upper()}] {text}")
                text_queue.put(text)
        except Exception as e:
            log(f"[!] Lỗi Whisper: {e}")

# --- TRANSLATE & TTS THREAD ---
def process_text_thread():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    while True:
        text = text_queue.get()
        try:
            translator = GoogleTranslator(source=CURRENT_LANG, target='vi')
            vi_text = translator.translate(text)
            log(f"[VIE] {vi_text}")
            
            # Gửi phụ đề về cho tất cả extension clients
            msg = json.dumps({"type": "subtitle", "text": vi_text})
            for ws in active_connections:
                asyncio.run_coroutine_threadsafe(ws.send(msg), ws.loop)
            
            # Sinh giọng đọc
            loop.run_until_complete(generate_tts(vi_text))
            
        except Exception as e:
            log(f"[!] Lỗi Dịch/TTS: {e}")

async def generate_tts(text):
    communicate = edge_tts.Communicate(text, "vi-VN-HoaiMyNeural")
    audio_data = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data += chunk["data"]
            
    if audio_data:
        audio_play_queue.put(audio_data)

# --- PLAYBACK THREAD ---
def playback_thread():
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
            log(f"[!] Lỗi Playback: {e}")

# --- WEBSOCKET SERVER ---
async def handle_client(websocket):
    log(f"[*] Có Client mới kết nối!")
    active_connections.add(websocket)
    websocket.loop = asyncio.get_running_loop()
    
    global pcm_buffer
    
    try:
        async for message in websocket:
            if isinstance(message, bytes):
                # Nhận Float32Array từ trình duyệt
                chunk = np.frombuffer(message, dtype=np.float32)
                pcm_buffer = np.concatenate((pcm_buffer, chunk))
                
                # Cắt đoạn 3 giây
                while len(pcm_buffer) >= CHUNK_FRAMES:
                    to_process = pcm_buffer[:CHUNK_FRAMES]
                    pcm_buffer = pcm_buffer[CHUNK_FRAMES:]
                    audio_queue.put(to_process)
            else:
                try:
                    data = json.loads(message)
                    if data.get("type") == "config":
                        global CURRENT_LANG
                        CURRENT_LANG = data.get("sourceLang", "en")
                        log(f"[*] Cấu hình ngôn ngữ gốc: {CURRENT_LANG}")
                except:
                    pass
    except websockets.exceptions.ConnectionClosed:
        log("[*] Client đã đóng kết nối.")
    finally:
        active_connections.remove(websocket)

async def main():
    try:
        log("[*] Khởi động Local AI Server (ws://127.0.0.1:8765)...")
        async with websockets.serve(handle_client, "127.0.0.1", 8765):
            log("[*] WebSocket server started listening.")
            await asyncio.Future()  # run forever
    except Exception as e:
        log(f"[!] WebSocket server error: {e}")

if __name__ == "__main__":
    threading.Thread(target=stt_thread, daemon=True).start()
    threading.Thread(target=process_text_thread, daemon=True).start()
    threading.Thread(target=playback_thread, daemon=True).start()
    
    try:
        log("[*] Main thread starting asyncio run...")
        asyncio.run(main())
    except KeyboardInterrupt:
        log("\n[*] Tắt Server.")
    except Exception as e:
        log(f"[!] Main thread error: {e}")
