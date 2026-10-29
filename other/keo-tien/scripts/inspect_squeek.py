import urllib.request, re, json

req = urllib.request.Request('https://squeekchain.com/assets/index-FEO1DWVF.js', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        print('JS file length:', len(content))
        
        # Look for API endpoints
        apis = re.findall(r'https?://[^\s"\'`]+', content)
        print('Unique URLs/APIs:', set([u for u in apis if any(k in u for k in ['squeek', 'api', 'chain', 'rpc', 'wss'])][:15]))
        
        # Look for contracts
        contracts = re.findall(r'0x[a-fA-F0-9]{40}', content)
        print('Contract addresses found:', set(contracts))
        
        # Look for keywords
        for kw in ['genesis', 'invite', 'mint', 'miner', 'hamster', 'reward', 'proof of work', 'rank', 'leaderboard', 'claim', 'gas']:
            matches = [m.start() for m in re.finditer(kw, content, re.IGNORECASE)]
            print(f'Keyword "{kw}": {len(matches)} occurrences')
            
        # Extract snippet around genesis
        for m in re.finditer(r'genesis', content, re.IGNORECASE):
            idx = m.start()
            print('--- Snippet around genesis ---')
            print(content[max(0, idx-100):min(len(content), idx+200)])
            break
except Exception as e:
    print('Err:', e)

