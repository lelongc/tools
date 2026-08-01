import json
import os
import shutil

# Rename c1.py to c2.py (since it contains backend logic)
if os.path.exists('c1.py'):
    shutil.move('c1.py', 'c2.py')

# Create c1.py (Dependencies)
c1_content = """# @title 1. Cài đặt các thư viện cần thiết (Chỉ chạy 1 lần)
!pip install requests ipywidgets opencv-python pillow numpy nest_asyncio edge-tts moviepy whisper
"""
with open('c1.py', 'w', encoding='utf-8') as f:
    f.write(c1_content)

# Prepend title to c2.py
c2_content = open('c2.py', 'r', encoding='utf-8').read()
if not c2_content.startswith("# @title 2."):
    c2_content = "# @title 2. Khởi tạo Core Backend (Chạy 1 lần sau khi cài thư viện)\n" + c2_content
    with open('c2.py', 'w', encoding='utf-8') as f:
        f.write(c2_content)

# Rename ui_code.py to c3.py
if os.path.exists('ui_code.py'):
    shutil.move('ui_code.py', 'c3.py')
c3_content = open('c3.py', 'r', encoding='utf-8').read()

# Rebuild notebook
nb = {
  'cells': [
    {
      'cell_type': 'markdown',
      'metadata': {'id': 'view-in-github', 'colab_type': 'text'},
      'source': ['<a href="https://colab.research.google.com/github/lelongc/tools/blob/main/short/shortv2/anime_short.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>']
    },
    {
      'cell_type': 'code',
      'execution_count': None,
      'metadata': {'id': 'cell-1'},
      'outputs': [],
      'source': [line + '\n' for line in c1_content.splitlines()]
    },
    {
      'cell_type': 'code',
      'execution_count': None,
      'metadata': {'id': 'cell-2'},
      'outputs': [],
      'source': [line + '\n' for line in c2_content.splitlines()]
    },
    {
      'cell_type': 'code',
      'execution_count': None,
      'metadata': {'id': 'cell-3'},
      'outputs': [],
      'source': [line + '\n' for line in c3_content.splitlines()]
    }
  ],
  'metadata': {
    'colab': {'provenance': []},
    'kernelspec': {'display_name': 'Python 3', 'name': 'python3'}
  },
  'nbformat': 4,
  'nbformat_minor': 0
}

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
