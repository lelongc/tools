import requests
import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

r = requests.get('https://ptah.trade/api/poa/live', timeout=15).json()
periods = r['data']['periods']['data']['list']
for p in periods:
    if p['index'] in [4, 5, 6]:
        idx = p['index']
        st = p['status']
        ent = p['entrants']
        pool_wei = p.get('pool_wei')
        per_slot = p.get('per_slot_wei')
        val = p.get('payout_valuation')
        print(f"=== Period {idx} ===")
        print(f"Status: {st} | Entrants: {ent}")
        if pool_wei:
            pool_ptah = int(pool_wei) / 10**18
            slot_ptah = int(per_slot) / 10**18
            print(f"Pool PTAH: {pool_ptah:,.2f} PTAH | Per Slot: {slot_ptah:,.2f} PTAH")
        if val:
            price = float(val.get('price_usd', 0))
            if per_slot:
                usd_val = (int(per_slot) / 10**18) * price
                print(f"Slot Value USD: ~${usd_val:.2f} USD (Price: ${price:.6f})")

price_usd = float(r['data']['token_price']['data']['price_usd'])
print(f"\nCurrent PTAH Market Price: ${price_usd:.6f} USD")

