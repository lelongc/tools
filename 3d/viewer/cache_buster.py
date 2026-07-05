import os
import re
import time

timestamp = str(int(time.time()))

def bust_cache_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace .js' or .js?v=123' with .js?v=TIMESTAMP'
    # For HTML files: .js" or .js?v=123"
    content = re.sub(r'\.js(\?v=\d+)?(["\'])', f'.js?v={timestamp}\\2', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.js') or file.endswith('.html'):
                filepath = os.path.join(root, file)
                bust_cache_in_file(filepath)

if __name__ == '__main__':
    process_directory('.')
    print(f"Cache busted with timestamp {timestamp}")
