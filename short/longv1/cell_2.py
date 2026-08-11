from google.colab import drive
print("🔗 Đang yêu cầu quyền truy cập Google Drive...")
drive.mount('/content/drive')

print("⏳ Đang cài đặt thư viện lõi (Whisper, Gemini)...")
!apt-get install -y ffmpeg
!pip install -q openai-whisper google-genai requests

import whisper
import os
import json
import zipfile
import re
import shutil
import time
from google import genai
from google.genai import types
import IPython.display as display
import random

