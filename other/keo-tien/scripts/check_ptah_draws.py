import requests
import json

r = requests.get('https://ptah.trade/api/poa/live', headers={'User-Agent': 'Mozilla/5.0'}).json()
print("Keys in live:", r['data'].keys())
draws = r['data']['draws']['data']['draws']
for d in draws[:6]:
    print(f"Day {d['index']}: status={d['status']}, entrants={d['entrants']}, window={d['window_start']} -> {d['window_end']}, pool={d['pool_wei']}")

print("\nOther keys in live data:")
for k, v in r['data'].items():
    if k != 'draws':
        print(f"  {k}: {json.dumps(v)[:200]}")
