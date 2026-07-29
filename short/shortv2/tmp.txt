# @title 🛠️ 1. Cài đặt Thư viện Studio & Kết nối Google Drive
import warnings
warnings.filterwarnings('ignore')
from google.colab import drive
import os
if not os.path.exists('/content/drive/MyDrive'):
    drive.mount('/content/drive')
!pip install -q curl_cffi google-genai edge-tts openai-whisper ipywidgets pillow requests moviepy ffmpeg-python nest_asyncio proglog
import nest_asyncio
nest_asyncio.apply()
print("✅ Hoàn tất cài đặt môi trường Anime Studio!")