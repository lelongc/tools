import json
import os

c1_content = open('c1.py', 'r', encoding='utf-8').read()
c2_content = open('c2.py', 'r', encoding='utf-8').read()
c3_content = open('c3.py', 'r', encoding='utf-8').read()
c5_content = open('c5_metadata.py', 'r', encoding='utf-8').read()

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
    },
    {
      'cell_type': 'code',
      'execution_count': None,
      'metadata': {'id': 'cell-4'},
      'outputs': [],
      'source': [line + '\n' for line in c5_content.splitlines()]
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

print("Rebuilt anime_short.ipynb successfully with Cell 4 Metadata Generator!")
