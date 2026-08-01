# @title 1. Cài đặt thư viện và Kết nối Google Drive (Chỉ chạy 1 lần)
!pip install requests ipywidgets opencv-python pillow numpy nest_asyncio edge-tts moviepy whisper duckduckgo-search

from google.colab import drive
drive.mount('/content/drive')
