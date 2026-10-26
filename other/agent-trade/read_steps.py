import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
log_path = r'C:\Users\Acer\.gemini\antigravity-ide\brain\667a5c94-1188-4fce-8846-c60e367ed04e\.system_generated\logs\transcript.jsonl'
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        idx = obj.get('step_index')
        if idx in [676, 684, 730, 754, 755]:
            print(f'=== STEP {idx} ===')
            content = obj.get('content') or obj.get('thinking') or str(obj.get('tool_calls'))
            print(str(content)[:500])
